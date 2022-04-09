import Machinat from '@machinat/core';
import { MAX_CHALLENGES } from '../constants';
import ShareGame from './ShareGame';
import WithMenu from './WithMenu';

type GameSummaryProps = {
  answer: string;
  finishTime: undefined | number;
  guesses: string[];
};

function random<T>(choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)];
}

const GameSummary = ({ answer, finishTime, guesses }: GameSummaryProps) => {
  const isWinned = typeof finishTime !== 'undefined';
  const words = !isWinned
    ? `Oops! The answer is ${answer.toUpperCase()}`
    : guesses.length === 1
    ? random(['WOOOW!', 'How you do that!', 'Unbelievable!'])
    : guesses.length <= 3
    ? random(["That's amazing!", 'Excellent!', 'Awesome!'])
    : guesses.length < MAX_CHALLENGES
    ? random(['Good job!', 'Well done!', 'Nice!'])
    : guesses.length === MAX_CHALLENGES
    ? random(["That's a close one!"])
    : 'Cool';

  return (
    <>
      <p>
        {words}
        {isWinned ? ' ' + random(['🎉', '🎊']) : ''}
      </p>
      <ShareGame
        noDescription
        answer={answer}
        finishTime={finishTime}
        guesses={guesses}
      />
      <WithMenu gameFinished>See you tomorrow</WithMenu>
    </>
  );
};

export default GameSummary;
