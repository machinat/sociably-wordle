import Machinat, { MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Twitter from '@machinat/twitter/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';

type WithYesNoRepliesProps = {
  children: MachinatNode;
};

const WithYesNoReplies = (
  { children }: WithYesNoRepliesProps,
  { platform }
) => {
  const yesWords = 'Yes';
  const yesData = JSON.stringify({ action: 'yes' });
  const noWords = 'No';
  const noData = JSON.stringify({ action: 'no' });

  if (platform === 'messenger') {
    return (
      <Messenger.Expression
        quickReplies={
          <>
            <Messenger.TextReply title={yesWords} payload={yesData} />
            <Messenger.TextReply title={noWords} payload={noData} />
          </>
        }
      >
        {children}
      </Messenger.Expression>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={
          <Telegram.ReplyKeyboard oneTimeKeyboard resizeKeyboard>
            <Telegram.TextReply text={yesWords} />
            <Telegram.TextReply text={noWords} />
          </Telegram.ReplyKeyboard>
        }
      >
        {children}
      </Telegram.Expression>
    );
  }

  if (platform === 'twitter') {
    return (
      <Twitter.Expression
        quickReplies={
          <>
            <Twitter.QuickReply label={yesWords} metadata={yesData} />
            <Twitter.QuickReply label={noWords} metadata={noData} />
          </>
        }
      >
        {children}
      </Twitter.Expression>
    );
  }

  if (platform === 'line') {
    return (
      <Line.Expression
        quickReplies={
          <>
            <Line.QuickReply>
              <Line.PostbackAction
                displayText={yesWords}
                label={yesWords}
                data={yesData}
              />
            </Line.QuickReply>
            <Line.QuickReply>
              <Line.PostbackAction
                displayText={noWords}
                label={noWords}
                data={noData}
              />
            </Line.QuickReply>
          </>
        }
      >
        {children}
      </Line.Expression>
    );
  }

  return <>{children}</>;
};

export default WithYesNoReplies;
