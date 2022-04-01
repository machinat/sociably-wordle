import { getGuessStatuses } from '../../utils/statuses';
import { Cell } from './Cell';
import { unicodeSplit } from '../../utils/words';

type Props = {
  guess: string;
  isRevealing?: boolean;
};

export const CompletedRow = ({ guess, isRevealing }: Props) => {
  const statuses = getGuessStatuses(guess);
  const splitGuess = unicodeSplit(guess);

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  );
};
