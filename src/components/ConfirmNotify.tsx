import Sociably from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import * as Twitter from '@sociably/twitter/components';
import * as Telegram from '@sociably/telegram/components';
import * as Line from '@sociably/line/components';
import { formatHour } from '../utils';

type ConfirmNotifyProps = {
  notifHour: undefined | number;
};

const ConfirmNotify = ({ notifHour }: ConfirmNotifyProps, { platform }) => {
  let isSubscribe: boolean;
  let message: string;

  if ((isSubscribe = typeof notifHour === 'number')) {
    message = `I'll notify you at ${formatHour(notifHour)} 👍`;
  } else {
    message = 'Ok, comback anytime!';
  }

  const cancelText = 'Cancel 🔕';
  const cancelData = JSON.stringify({ action: 'cancel_notify' });
  const changeText = 'Change Time ⌚';
  const changeData = JSON.stringify({ action: 'update_notify_time' });
  const notifyText = 'Notify Me 🔔';
  const notifyData = JSON.stringify({ action: 'notify' });

  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={
          isSubscribe ? (
            <>
              <Messenger.PostbackButton
                title={changeText}
                payload={changeData}
              />
              <Messenger.PostbackButton
                title={cancelText}
                payload={cancelData}
              />
            </>
          ) : (
            <Messenger.PostbackButton title={notifyText} payload={notifyData} />
          )
        }
      >
        {message}
      </Messenger.ButtonTemplate>
    );
  }

  if (platform === 'twitter') {
    return (
      <Twitter.DirectMessage
        quickReplies={
          isSubscribe ? (
            <>
              <Twitter.QuickReply label={changeText} metadata={changeData} />
              <Twitter.QuickReply label={cancelText} metadata={cancelData} />
            </>
          ) : (
            <Twitter.QuickReply label={notifyText} metadata={notifyData} />
          )
        }
      >
        {message}
      </Twitter.DirectMessage>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Text
        replyMarkup={
          <Telegram.InlineKeyboard>
            {isSubscribe ? (
              <>
                <Telegram.CallbackButton text={changeText} data={changeData} />
                <Telegram.CallbackButton text={cancelText} data={cancelData} />
              </>
            ) : (
              <Telegram.CallbackButton text={notifyText} data={notifyData} />
            )}
          </Telegram.InlineKeyboard>
        }
      >
        {message}
      </Telegram.Text>
    );
  }

  if (platform === 'line') {
    return (
      <Line.ButtonTemplate
        altText={(template) => template.text}
        actions={
          isSubscribe ? (
            <>
              <Line.PostbackAction
                label={changeText}
                displayText={changeText}
                data={changeData}
              />
              <Line.PostbackAction
                label={cancelText}
                displayText={cancelText}
                data={cancelData}
              />
            </>
          ) : (
            <Line.PostbackAction
              label={notifyText}
              displayText={notifyText}
              data={notifyData}
            />
          )
        }
      >
        {message}
      </Line.ButtonTemplate>
    );
  }

  return <p>{message}</p>;
};

export default ConfirmNotify;
