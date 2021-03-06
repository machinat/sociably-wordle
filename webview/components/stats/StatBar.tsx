import { GameStats } from '../../../src/types';
import {
  TOTAL_TRIES_TEXT,
  SUCCESS_RATE_TEXT,
  CURRENT_STREAK_TEXT,
  BEST_STREAK_TEXT,
} from '../../strings';

type Props = {
  gameStats: GameStats;
};

const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="items-center justify-center m-1 w-1/4 dark:text-white">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
};

export const StatBar = ({ gameStats }: Props) => {
  const winnedGames = gameStats.winCounts.reduce((sum, c) => sum + c, 0);
  const totalGames = winnedGames + gameStats.failCount;

  return (
    <div className="flex justify-center my-2">
      <StatItem label={TOTAL_TRIES_TEXT} value={totalGames} />
      <StatItem
        label={SUCCESS_RATE_TEXT}
        value={`${
          totalGames !== 0 ? ((winnedGames / totalGames) * 100).toFixed() : 0
        }%`}
      />
      <StatItem label={CURRENT_STREAK_TEXT} value={gameStats.currentStreak} />
      <StatItem label={BEST_STREAK_TEXT} value={gameStats.bestStreak} />
    </div>
  );
};
