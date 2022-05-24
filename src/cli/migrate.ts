#!/usr/bin/env node
import { resolve as resolvePath } from 'path';
import DialogFlow from '@machinat/dialogflow';
import { Umzug, JSONStorage } from 'umzug';
import { program } from 'commander';
import createApp from '../app';

const app = createApp({ noServer: true });

const umzug = new Umzug({
  storage: new JSONStorage({
    path: resolvePath('./.executed_migrations.json'),
  }),
  logger: console,
  migrations: {
    glob: resolvePath(
      __dirname,
      `../migrations/*.${__dirname.includes('/src/') ? 'ts?(x)' : 'js'}`
    ),
    resolve: ({ name, path }) => {
      return {
        name: name.replace(/.[t|j]sx?$/, ''),
        up: async () => {
          const { up } = await import(path as string);
          if (up) {
            const scope = app.serviceSpace.createScope();
            await scope.injectContainer(up);
          }
        },
        down: async () => {
          const { down } = await import(path as string);
          if (down) {
            const scope = app.serviceSpace.createScope();
            await scope.injectContainer(down);
          }
        },
      };
    },
  },
});

program
  .usage('[options]')
  .option('--down', 'roll back down')
  .parse(process.argv);

const options = program.opts();

async function migrate() {
  await app.start();

  if (options.down) {
    await umzug.down();
  } else {
    await umzug.up();
  }

  const [dialogflowRecognizer] = app.useServices([DialogFlow.Recognizer]);
  console.log('[dialogflow:train] start updating dialogflow');

  const isUpdated = await dialogflowRecognizer.train();
  console.log(
    `[dialogflow:train] ${
      isUpdated ? 'new agent version is created' : 'agent version is up to date'
    }`
  );

  await app.stop();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
