# Sociably Wordle

Play Wordle in social media.
> This is an example app built with [Sociably](https://sociably.js.org) framework.

## Demo

Try the bot on these platforms:

- [Messenger](https://m.me/SociablyWordle)
- [Twitter](https://twitter.com/SociablyWordle)
- [Telegram](https://t.me/SociablyWordleBot)
- [LINE](https://line.me/ti/p/@101irzqr)

## Getting Started

> You have to finish the [Environments Setup](#environments-setup)
> before you start developing.

Run the app in development mode with:

```bash
npm run dev
```

The command does two things:

1. Start a dev server up. It'll refresh automatically when codes are changed.
2. Connect a HTTP tunnel to a _https://xxx.t.machinat.dev_ endpoint.
   It's used to receive webhook requests from the chat platforms.

### Environments Setup

#### Chat Platform Settings

You need to configure the platforms and fill the settings in the `.env` file.
Check `.env.example` file for guides and usage examples.

#### Run Dev Server

Start the server with `npm run dev` command.
It should work if all the required environments are filled at the last step.

#### Initiate Platform Bindings

Keep the dev server running and execute this command in a _new command line tab_:

```bash
npm run migrate
```

This register webhooks and other settings on the chat platforms.
If you want to cancel these changes,
use `npm run migrate -- --down` to revert.

#### Start Developing

Now you can go to the chat platforms and try your bot.
Keep the dev server running while developing.
The changes in codes will immediately reflect on the bot.

Here are some resources to learn Sociably framework:

- [Documents](https://sociably.js.org/doc) - complete guides by topics
- [Tutorial](https://sociably.js.org/docs/learn) - a step-by-step tutorial to make an app
- [API references](https://sociably.js.org/api) - detailed framework API
