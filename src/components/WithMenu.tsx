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
};

const WithMenu = ({ children }: WithMenuProps, { platform }) => {
  const webviewText = 'Open Webview ↗️';
  const aboutText = 'About ℹ';
  const aboutData = JSON.stringify({ action: 'about' });

  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={
          <>
            <Messenger.PostbackButton title={aboutText} payload={aboutData} />
            <MessengerWebviewButton title={webviewText} />
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
        buttons={<TwitterWebviewButton label={webviewText} />}
        quickReplies={
          <Twitter.QuickReply label={aboutText} metadata={aboutData} />
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
            <Telegram.CallbackButton text={aboutText} data={aboutData} />
            <TelegramWebviewButton text={webviewText} />
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
              label={aboutText}
              displayText={aboutText}
              data={aboutData}
            />
            <LineWebviewAction label={webviewText} />
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
