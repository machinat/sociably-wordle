import Sociably from '@sociably/core';
import Http from '@sociably/http';
import Messenger from '@sociably/messenger';
import MessengerAuth from '@sociably/messenger/webview';
import Line from '@sociably/line';
import LineAuth from '@sociably/line/webview';
import Twitter from '@sociably/twitter';
import TwitterAssetManager from '@sociably/twitter/asset';
import TwitterAuth from '@sociably/twitter/webview';
import Telegram from '@sociably/telegram';
import TelegramAuth from '@sociably/telegram/webview';
import Webview from '@sociably/webview';
import Script from '@sociably/script';
import RedisState from '@sociably/redis-state';
import { FileState } from '@sociably/dev-tools';
import Dialogflow from '@sociably/dialogflow';
import nextConfigs from '../webview/next.config.js';
import useIntent from './services/useIntent';
import useUserProfile from './services/useUserProfile';
import useWordleGame from './services/useWordleGame';
import useWordleState from './services/useWordleState';
import useGlobalStatistics from './services/useGlobalStatistics';
import Timer from './services/Timer';
import recognitionData from './recognitionData';
import * as scenes from './scenes';

const {
  // basic
  APP_NAME,
  NODE_ENV,
  PORT,
  DOMAIN,
  // webview
  WEBVIEW_AUTH_SECRET,
  // messenger
  MESSENGER_PAGE_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  // twitter
  TWITTER_APP_ID,
  TWITTER_APP_KEY,
  TWITTER_APP_SECRET,
  TWITTER_BEARER_TOKEN,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
  // telegram
  TELEGRAM_BOT_NAME,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_SECRET_PATH,
  // line
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET,
  LINE_LIFF_ID,
  // redis
  REDIS_URL,
  // dialogflow
  DIALOGFLOW_PROJECT_ID,
} = process.env as Record<string, string>;

const DEV = NODE_ENV === 'development';

type CreateAppOptions = {
  noServer?: boolean;
};

const createApp = (options?: CreateAppOptions) => {
  return Sociably.createApp({
    modules: [
      Http.initModule({
        noServer: options?.noServer,
        listenOptions: {
          port: PORT ? Number(PORT) : 8080,
        },
      }),

      DEV
        ? FileState.initModule({
            path: './.state_data.json',
          })
        : RedisState.initModule({
            clientOptions: {
              url: REDIS_URL,
            },
          }),

      Dialogflow.initModule({
        recognitionData,
        environment: `sociably-wordle-${DEV ? 'dev' : 'prod'}`,
        projectId: DIALOGFLOW_PROJECT_ID,
      }),

      Script.initModule({
        libs: Object.values(scenes),
      }),
    ],

    platforms: [
      Messenger.initModule({
        webhookPath: '/webhook/messenger',
        pageId: MESSENGER_PAGE_ID,
        appSecret: MESSENGER_APP_SECRET,
        accessToken: MESSENGER_ACCESS_TOKEN,
        verifyToken: MESSENGER_VERIFY_TOKEN,
      }),

      Twitter.initModule({
        webhookPath: '/webhook/twitter',
        appId: TWITTER_APP_ID,
        appKey: TWITTER_APP_KEY,
        appSecret: TWITTER_APP_SECRET,
        bearerToken: TWITTER_BEARER_TOKEN,
        accessToken: TWITTER_ACCESS_TOKEN,
        accessSecret: TWITTER_ACCESS_SECRET,
      }),

      Telegram.initModule({
        webhookPath: '/webhook/telegram',
        botName: TELEGRAM_BOT_NAME,
        botToken: TELEGRAM_BOT_TOKEN,
        secretPath: TELEGRAM_SECRET_PATH,
      }),

      Line.initModule({
        webhookPath: '/webhook/line',
        providerId: LINE_PROVIDER_ID,
        channelId: LINE_CHANNEL_ID,
        accessToken: LINE_ACCESS_TOKEN,
        channelSecret: LINE_CHANNEL_SECRET,
        liffId: LINE_LIFF_ID,
      }),

      Webview.initModule<MessengerAuth | TwitterAuth | TelegramAuth | LineAuth>(
        {
          webviewHost: DOMAIN,
          webviewPath: '/webview',
          authSecret: WEBVIEW_AUTH_SECRET,
          authPlatforms: [MessengerAuth, TwitterAuth, TelegramAuth, LineAuth],
          cookieSameSite: 'none',
          noNextServer: options?.noServer,
          nextServerOptions: {
            dev: DEV,
            dir: './webview',
            conf: nextConfigs,
          },
          basicAuth: {
            mode: 'loose',
            appName: APP_NAME,
            appIconUrl: 'https://raw.githubusercontent.com/machinat/sociably-wordle/main/media/icon.png',
          },
        }
      ),
    ],

    services: [
      useIntent,
      useUserProfile,
      useWordleGame,
      useWordleState,
      useGlobalStatistics,
      Timer,
      TwitterAssetManager,
    ],
  });
};

export default createApp;
