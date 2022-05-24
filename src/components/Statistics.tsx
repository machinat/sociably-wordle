import Machinat from '@machinat/core';
import { formatTime } from '../utils';
import { GameStats } from '../types';

type StatCardProps = {
  gameStats: GameStats;
};

const getRatioBar = (count: number, maxCount: number, total: number) => {
  if (!count || !total) {
    return '';
  }
  return (
    new Array(Math.round((count / maxCount) * 6)).fill('🟩').join('') +
    ` ${count}`
  );
};

const StatCard = ({ gameStats }: StatCardProps) => {
  const { winCounts, failCount, totalWinTime, currentStreak, bestStreak } =
    gameStats;

  const winnedGames = winCounts.reduce((sum, c) => sum + c, 0);
  const totalGames = winnedGames + failCount;
  const avgTime = winnedGames !== 0 ? totalWinTime / winnedGames : 0;
  const maxCount = Math.max(...winCounts, failCount);

  return (
    <>
      <p>📜 Game Records:</p>
      <p>
        🏆 Wins {winnedGames}
        <br />
        💪 Win Rate {totalGames && ((winnedGames / totalGames) * 100).toFixed()}
        %<br />⏰ Avg. Time {formatTime(avgTime)}
        <br />
        🔥 Streak {currentStreak}
        <br />
        🥇 Best Streak {bestStreak}
        <br />
        <br />
      </p>
      <p>📊 Guess Distribution:</p>
      <p>
        {winCounts.map((count, i) => (
          <>
            {i + 1}: {getRatioBar(count, maxCount, winnedGames)}
            <br />
          </>
        ))}
        X: {getRatioBar(failCount, maxCount, winnedGames)}
      </p>
    </>
  );
};

export default StatCard;
