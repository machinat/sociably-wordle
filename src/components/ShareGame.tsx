import Machinat from '@machinat/core';
import { AGNET_TAG_NAME, MAX_CHALLENGES, CharStatus } from '../constants';
import { getDayIndex, getGuessStatuses, formatTime } from '../utils';

type ShareGameProps = {
  noDescription?: boolean;
  answer: string;
  finishTime: undefined | number;
  guesses: string[];
};

const ShareGame = ({
  answer,
  finishTime,
  guesses,
  noDescription,
}: ShareGameProps) => {
  const day = getDayIndex(Date.now());
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
    <>
      {noDescription || <p>Share today's record 👇</p>}
      <p>
        @{AGNET_TAG_NAME}
        <br />#{day}
        {time}
        {'  '}
        {typeof finishTime !== 'undefined' ? guesses.length : 'X'}/
        {MAX_CHALLENGES}
        <br />
        {guessTiles}
      </p>
    </>
  );
};

export default ShareGame;
