import Machinat from '@machinat/core';
import { AGENT_TAG_NAME, MAX_CHALLENGES, CharStatus } from '../constants';
import { getGuessStatuses, formatTime } from '../utils';

type ShareGameTextProps = {
  day: number;
  answer: string;
  finishTime: undefined | number;
  guesses: string[];
};

const ShareGameText = ({
  day,
  answer,
  finishTime,
  guesses,
}: ShareGameTextProps) => {
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
  return (
    <p>
      @{AGENT_TAG_NAME}
      <br />#{day}
      {time}
      {'  '}
      {typeof finishTime !== 'undefined' ? guesses.length : 'X'}/
      {MAX_CHALLENGES}
      <br />
      {guessTiles}
    </p>
  );
};

export default ShareGameText;
