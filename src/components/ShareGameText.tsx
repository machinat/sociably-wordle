import Machinat from '@machinat/core';
import * as Twitter from '@machinat/twitter/components';
import { AGENT_TAG_NAME, MAX_CHALLENGES, CharStatus } from '../constants';
import { getGuessStatuses, formatTime } from '../utils';

type ShareGameTextProps = {
  day: number;
  answer: string;
  finishTime: undefined | number;
  guesses: string[];
};

const getShareString = (
  day: number,
  answer: string,
  finishTime: undefined | number,
  guesses: string[]
) => {
  const time =
    typeof finishTime !== 'undefined' ? `  ${formatTime(finishTime!)}` : '';
  const guessTiles = guesses
    .map((guess) => {
      const statuses = getGuessStatuses(guess, answer);
      return statuses
        .map((status) =>
          status === CharStatus.Correct
            ? '🟩'
            : status === CharStatus.Present
            ? '🟨'
            : '⬜'
        )
        .join('');
    })
    .join('\n');

  return `@${AGENT_TAG_NAME}
#${day} ${time} ${
    typeof finishTime !== 'undefined' ? guesses.length : 'X'
  }/${MAX_CHALLENGES}
${guessTiles}`;
};

const ShareGameText = (
  { day, answer, finishTime, guesses }: ShareGameTextProps,
  { platform }
) => {
  const shareString = getShareString(day, answer, finishTime, guesses);

  if (platform === 'twitter') {
    return (
      <Twitter.DirectMessage
        buttons={
          <Twitter.UrlButton
            label="Tweet 📤"
            url={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareString
            )}`}
          />
        }
      >
        {shareString}
      </Twitter.DirectMessage>
    );
  }

  return <p>{shareString}</p>;
};

export default ShareGameText;
