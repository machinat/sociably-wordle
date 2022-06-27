import Sociably, { SociablyNode } from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import * as Twitter from '@sociably/twitter/components';
import * as Telegram from '@sociably/telegram/components';
import * as Line from '@sociably/line/components';

type WithYesNoRepliesProps = {
  children: SociablyNode;
  yesOnly?: boolean;
  yesText?: string;
  noOnly?: boolean;
  noText?: string;
};

const WithYesNoReplies = (
  { children, yesOnly, yesText, noOnly, noText }: WithYesNoRepliesProps,
  { platform }
) => {
  if (yesOnly && noOnly) {
    return null;
  }

  const yesWords = yesText || 'Yes';
  const yesData = JSON.stringify({ action: 'yes' });
  const noWords = noText || 'No';
  const noData = JSON.stringify({ action: 'no' });

  if (platform === 'messenger') {
    return (
      <Messenger.Expression
        quickReplies={
          <>
            {yesOnly && (
              <Messenger.TextReply title={yesWords} payload={yesData} />
            )}
            {noOnly && <Messenger.TextReply title={noWords} payload={noData} />}
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
            {yesOnly && <Telegram.TextReply text={yesWords} />}
            {noOnly && <Telegram.TextReply text={noWords} />}
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
            {yesOnly && (
              <Twitter.QuickReply label={yesWords} metadata={yesData} />
            )}
            {noOnly && <Twitter.QuickReply label={noWords} metadata={noData} />}
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
            {yesOnly && (
              <Line.QuickReply>
                <Line.PostbackAction
                  displayText={yesWords}
                  label={yesWords}
                  data={yesData}
                />
              </Line.QuickReply>
            )}
            {noOnly && (
              <Line.QuickReply>
                <Line.PostbackAction
                  displayText={noWords}
                  label={noWords}
                  data={noData}
                />
              </Line.QuickReply>
            )}
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
