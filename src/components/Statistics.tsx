import Machinat from '@machinat/core';
import { formatTime } from '../utils';
import { GameStats } from '../types';

type StatCardProps = {
  gameStats: GameStats;
};

const getShareBlocks = (count: number, total: number) => {
  const ratio = total !== 0 ? count / total : 0;
  return new Array(Math.floor(ratio / 0.125)).fill('█').join('');
};

const StatCard = ({ gameStats }: StatCardProps) => {
  const { winCounts, failCount, totalWinTime, currentStreak, bestStreak } =
    gameStats;

  const winnedGames = winCounts.reduce((sum, c) => sum + c, 0);
  const totalGames = winnedGames + failCount;
  const avgTime = winnedGames !== 0 ? totalWinTime / winnedGames : 0;

  return (
    <>
      <p>📜 Game Records:</p>
      <p>
        🏆 Wins {winnedGames}
        <br />
        💪 Win Rate {totalGames && ((winnedGames / totalGames) * 100).toFixed()}
        %<br />⏲ Avg. Time {formatTime(avgTime)}
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
            {i + 1} {getShareBlocks(count, winnedGames)} {count || null}
            <br />
          </>
        ))}
      </p>
    </>
  );
};

export default StatCard;
