import Machinat, { MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@machinat/messenger/webview';
import * as Twitter from '@machinat/twitter/components';
import { WebviewButton as TwitterWebviewButton } from '@machinat/twitter/webview';
import * as Telegram from '@machinat/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@machinat/telegram/webview';
import * as Line from '@machinat/line/components';
import { WebviewAction as LineWebviewAction } from '@machinat/line/webview';

type WithMenuProps = {
  children: MachinatNode;
  gameFinished?: boolean;
};

const WithMenu = ({ children, gameFinished }: WithMenuProps, { platform }) => {
  const gameText = gameFinished ? 'Check 🔤' : 'Play 🔤';
  const shareText = 'Share 📤';
  const shareData = JSON.stringify({ action: 'share' });
  const statsText = 'Statistics 📊';
  const statsData = JSON.stringify({ action: 'stats' });

  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={
          <>
            <Messenger.PostbackButton title={statsText} payload={statsData} />
            {gameFinished && (
              <Messenger.PostbackButton title={shareText} payload={shareData} />
            )}
            <MessengerWebviewButton title={gameText} />
          </>
        }
      >
        {children}
      </Messenger.ButtonTemplate>
    );
  }

  if (platform === 'twitter') {
    return (
      <Twitter.DirectMessage
        buttons={<TwitterWebviewButton label={gameText} />}
        quickReplies={
          <>
            <Twitter.QuickReply label={statsText} metadata={statsData} />
            {gameFinished && (
              <Twitter.QuickReply label={shareText} metadata={shareData} />
            )}
          </>
        }
      >
        {children}
      </Twitter.DirectMessage>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Text
        replyMarkup={
          <Telegram.InlineKeyboard>
            <Telegram.CallbackButton text={statsText} data={statsData} />
            {gameFinished && (
              <Telegram.CallbackButton text={shareText} data={shareData} />
            )}
            <TelegramWebviewButton text={gameText} />
          </Telegram.InlineKeyboard>
        }
      >
        {children}
      </Telegram.Text>
    );
  }

  if (platform === 'line') {
    return (
      <Line.ButtonTemplate
        altText={(template) => template.text}
        actions={
          <>
            <Line.PostbackAction
              label={statsText}
              displayText={statsText}
              data={statsData}
            />
            {gameFinished && (
              <Line.PostbackAction
                label={shareText}
                displayText={shareText}
                data={shareData}
              />
            )}
            <LineWebviewAction label={gameText} />
          </>
        }
      >
        {children}
      </Line.ButtonTemplate>
    );
  }

  return <p>{children}</p>;
};

export default WithMenu;
