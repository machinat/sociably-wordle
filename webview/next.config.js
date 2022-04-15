const {
  MESSENGER_PAGE_ID,
  TWITTER_ACCESS_TOKEN,
  TELEGRAM_BOT_NAME,
  LINE_LIFF_ID,
  MAX_CHALLENGES,
  EPOCH_DAY,
  APP_NAME,
  AGENT_TAG_NAME,
} = process.env;

module.exports = {
  distDir: '../dist',
  basePath: '/webview',
  publicRuntimeConfig: {
    MESSENGER_PAGE_ID,
    TWITTER_AGENT_ID: TWITTER_ACCESS_TOKEN.split('-', 1)[0],
    TELEGRAM_BOT_NAME,
    LINE_LIFF_ID,
    MAX_CHALLENGES,
    EPOCH_DAY,
    APP_NAME,
    AGENT_TAG_NAME,
  },
  experimental: {
    externalDir: true,
  },
};
