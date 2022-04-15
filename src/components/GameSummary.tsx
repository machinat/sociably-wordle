import Machinat from '@machinat/core';
import { MAX_CHALLENGES } from '../constants';
import ShareGameText from './ShareGameText';
import WithMenu from './WithMenu';

type GameSummaryProps = {
  day: number;
  answer: string;
  finishTime: undefined | number;
  guesses: string[];
  withNotifyButton?: boolean;
};

function random<T>(choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)];
}

const GameSummary = (
  { day, answer, finishTime, guesses, withNotifyButton }: GameSummaryProps,
  { platform }
) => {
  const isWinned = typeof finishTime !== 'undefined';
  const words = !isWinned
    ? `Oops! The answer is ${answer.toUpperCase()}`
    : guesses.length === 1
    ? random(['Wooow!', 'How you do that!', 'Unbelievable!'])
    : guesses.length <= 3
    ? random(['Terrific!', 'Amazing!', 'Awesome!'])
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
      <ShareGameText
        day={day}
        answer={answer}
        finishTime={finishTime}
        guesses={guesses}
      />
      <WithMenu
        isGameFinished
        withNotifyButton={withNotifyButton || platform === 'messenger'}
      >
        See you tomorrow!
      </WithMenu>
    </>
  );
};

export default GameSummary;
