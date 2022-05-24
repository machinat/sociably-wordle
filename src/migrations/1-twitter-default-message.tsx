import Machinat, { makeContainer } from '@machinat/core';
import Twitter from '@machinat/twitter';
import { DirectMessage, QuickReply } from '@machinat/twitter/components';
import TwitterAssetManager from '@machinat/twitter/asset';

export const up = makeContainer({
  deps: [Twitter.Bot, TwitterAssetManager],
})(async (twitterBot, twitterAssetManager) => {
  const welcomeId = await twitterAssetManager.renderWelcomeMessage(
    'default_greeting',
    <DirectMessage quickReplies={<QuickReply label="Start 👍" />}>
      Hello! 👋
    </DirectMessage>
  );
  await twitterBot.makeApiCall(
    'POST',
    '1.1/direct_messages/welcome_messages/rules/new.json',
    {
      welcome_message_rule: {
        welcome_message_id: welcomeId,
      },
    }
  );
});

export const down = makeContainer({
  deps: [TwitterAssetManager],
})(async (twitterAssetManager) => {
  await twitterAssetManager.deleteWelcomeMessage('default_greeting');
});
