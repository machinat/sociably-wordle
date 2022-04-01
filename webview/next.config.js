module.exports = {
  distDir: '../dist',
  basePath: '/webview',
  publicRuntimeConfig: {
    messengerPageId: process.env.MESSENGER_PAGE_ID,
    twitterAgentId: process.env.TWITTER_ACCESS_TOKEN.split('-', 1)[0],
    telegramBotName: process.env.TELEGRAM_BOT_NAME,
    lineLiffId: process.env.LINE_LIFF_ID,
  },
};
