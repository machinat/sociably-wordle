import { CharStatus } from '../../../src/constants';
import { Cell } from './Cell';
import { unicodeSplit } from '../../utils/words';

type Props = {
  guess: string;
  isRevealing?: boolean;
  result: CharStatus[];
};

export const CompletedRow = ({ guess, result, isRevealing }: Props) => {
  const splitGuess = unicodeSplit(guess);

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={result[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  );
};
