import { ServiceScope } from '@machinat/core/service';
import { fromApp, Stream } from '@machinat/stream';
import Timer from './services/Timer';
import main from './main';
import createApp from './app';
import { SOCIAL_POST_CHANNEL } from './constants';
import { AppEventContext, GameChannel } from './types';

const app = createApp();
app
  .start()
  .then(() => {
    const event$: Stream<AppEventContext> = fromApp(app);
    const [timer] = app.useServices([Timer]);

    timer.onTimesUp((targets) => {
      const [scope] = app.useServices([ServiceScope]);

      for (const target of targets) {
        if (target.channel.uid === SOCIAL_POST_CHANNEL.uid) {
          event$.next({
            key: undefined,
            scope,
            value: {
              platform: 'app',
              event: {
                platform: 'app',
                category: 'app',
                type: 'social_post',
                payload: null,
                channel: null,
                user: null,
              },
            },
          });
        } else {
          const channel = target.channel as GameChannel;
          const { platform, uid } = channel;
          event$.next({
            key: uid,
            scope,
            value: {
              platform,
              event: {
                platform,
                category: 'app',
                type: 'notify',
                payload: null,
                channel,
                user: null,
              },
            },
          });
        }
      }
    });

    main(event$);

    timer.start();
    return timer.registerTimer(SOCIAL_POST_CHANNEL, 0, 14);
  })
  .catch(console.error);
