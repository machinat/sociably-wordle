import { MAX_WORD_LENGTH } from '../../settings';
import { Cell } from './Cell';
import { unicodeSplit } from '../../utils/words';

type Props = {
  guess: string;
  className: string;
};

export const CurrentRow = ({ guess, className }: Props) => {
  const splitGuess = unicodeSplit(guess);
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH - splitGuess.length));
  const classes = `flex justify-center mb-1 ${className}`;

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
};
