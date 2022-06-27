import Sociably, { SociablyNode } from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@sociably/messenger/webview';
import * as Twitter from '@sociably/twitter/components';
import { WebviewButton as TwitterWebviewButton } from '@sociably/twitter/webview';
import * as Telegram from '@sociably/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@sociably/telegram/webview';
import * as Line from '@sociably/line/components';
import { WebviewAction as LineWebviewAction } from '@sociably/line/webview';

type WithMenuProps = {
  children: SociablyNode;
  isGameFinished?: boolean;
  withStatsButton?: boolean;
  withShareButton?: boolean;
  withNotifyButton?: boolean;
};

const WithMenu = (
  {
    children,
    isGameFinished,
    withStatsButton,
    withShareButton,
    withNotifyButton,
  }: WithMenuProps,
  { platform }
) => {
  const gameText = isGameFinished ? 'Check 🔤' : 'Play 🔤';
  const shareText = 'Share 📤';
  const shareData = JSON.stringify({ action: 'share' });
  const statsText = 'Statistics 📊';
  const statsData = JSON.stringify({ action: 'stats' });
  const notifyText = 'Notify Me 🔔';
  const notifyData = JSON.stringify({ action: 'notify' });

  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={
          <>
            {withNotifyButton && (
              <Messenger.PostbackButton
                title={notifyText}
                payload={notifyData}
              />
            )}
            {withStatsButton && (
              <Messenger.PostbackButton title={statsText} payload={statsData} />
            )}
            {withShareButton && (
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
            {withNotifyButton && (
              <Twitter.QuickReply label={notifyText} metadata={notifyData} />
            )}
            {withStatsButton && (
              <Twitter.QuickReply label={statsText} metadata={statsData} />
            )}
            {withShareButton && (
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
            {withNotifyButton && (
              <Telegram.CallbackButton text={notifyText} data={notifyData} />
            )}
            {withStatsButton && (
              <Telegram.CallbackButton text={statsText} data={statsData} />
            )}
            {withShareButton && (
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
            {withNotifyButton && (
              <Line.PostbackAction
                label={notifyText}
                displayText={notifyText}
                data={notifyData}
              />
            )}
            {withStatsButton && (
              <Line.PostbackAction
                label={statsText}
                displayText={statsText}
                data={statsData}
              />
            )}
            {withShareButton && (
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
