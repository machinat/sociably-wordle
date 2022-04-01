import { makeContainer } from '@machinat/core';
import Messenger from '@machinat/messenger';
import Twitter from '@machinat/twitter';
import TwitterAssetManager from '@machinat/twitter/asset';
import Telegram from '@machinat/telegram';
import Line from '@machinat/line';

const {
  DOMAIN,
  MESSENGER_PAGE_ID,
  MESSENGER_APP_ID,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  TWITTER_WEBHOOK_ENV,
  TELEGRAM_SECRET_PATH,
} = process.env as Record<string, string>;

const ENTRY_URL = `https://${DOMAIN}`;

export const up = makeContainer({
  deps: [
    Messenger.Bot,
    Twitter.Bot,
    TwitterAssetManager,
    Telegram.Bot,
    Line.Bot,
  ],
})(
  async (
    messengerBot,
    twitterBot,
    twitterAssetManager,
    telegramBot,
    lineBot
  ) => {
    // setup page profile in Messenger
    await messengerBot.makeApiCall('POST', 'me/messenger_profile', {
      greeting: [{ locale: 'default', text: 'Hello World!' }],
      whitelisted_domains: [ENTRY_URL],
    });

    // create Messenger webhook subscription, require running server in advance
    await messengerBot.makeApiCall(
      'POST',
      `${MESSENGER_APP_ID}/subscriptions`,
      {
        access_token: `${MESSENGER_APP_ID}|${MESSENGER_APP_SECRET}`,
        object: 'page',
        callback_url: `${ENTRY_URL}/webhook/messenger`,
        fields: ['messages', 'messaging_postbacks'],
        include_values: true,
        verify_token: MESSENGER_VERIFY_TOKEN,
      }
    );

    // add page to Messenger webhook
    await messengerBot.makeApiCall('POST', 'me/subscribed_apps', {
      subscribed_fields: ['messages', 'messaging_postbacks'],
    });

    // register webhook on Twitter
    await twitterAssetManager.setUpWebhook(
      'default',
      TWITTER_WEBHOOK_ENV,
      `${ENTRY_URL}/webhook/twitter`
    );

    // subscribe to Twitter agent user
    await twitterBot.makeApiCall(
      'POST',
      `1.1/account_activity/all/${TWITTER_WEBHOOK_ENV}/subscriptions.json`
    );

    // setup webhook of the Telegram bot
    await telegramBot.makeApiCall('setWebhook', {
      url: `${ENTRY_URL}/webhook/telegram/${TELEGRAM_SECRET_PATH}`,
    });

    // setup webhook of the LINE channel
    await lineBot.makeApiCall('PUT', 'v2/bot/channel/webhook/endpoint', {
      endpoint: `${ENTRY_URL}/webhook/line`,
    });
  }
);

export const down = makeContainer({
  deps: [Messenger.Bot, TwitterAssetManager, Telegram.Bot],
})(async (messengerBot, twitterAssetManager, telegramBot) => {
  // clear page profile in Messenger
  await messengerBot.makeApiCall('DELETE', 'me/messenger_profile', {
    fields: [
      'get_started',
      'greeting',
      'persistent_menu',
      'whitelisted_domains',
    ],
  });

  // delete app subscriptions
  await messengerBot.makeApiCall(
    'DELETE',
    `${MESSENGER_PAGE_ID}/subscribed_apps`,
    { access_token: `${MESSENGER_APP_ID}|${MESSENGER_APP_SECRET}` }
  );

  // remove page from webhook subscription
  await messengerBot.makeApiCall(
    'DELETE',
    `${MESSENGER_APP_ID}/subscriptions`,
    {
      access_token: `${MESSENGER_APP_ID}|${MESSENGER_APP_SECRET}`,
      object: 'page',
    }
  );

  // delete Twitter webhook
  await twitterAssetManager.deleteWebhook('default', TWITTER_WEBHOOK_ENV);

  // delete Telegram webhook
  await telegramBot.makeApiCall('deleteWebhook');
});
