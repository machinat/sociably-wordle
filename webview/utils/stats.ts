import { GameHistory } from '../../src/types';

export type GameStats = {
  winDistribution: number[];
  gamesFailed: number;
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  successRate: number;
};

export const getStatsFromHistory = (
  history: GameHistory,
  currentStreak: number
): GameStats => {
  const winnedGames = history.winCounts.reduce((sum, c) => sum + c, 0);
  const totalGames = winnedGames + history.failCount;
  return {
    totalGames,
    currentStreak,
    winDistribution: history.winCounts,
    gamesFailed: history.failCount,
    bestStreak: history.winCounts.findIndex((c) => c > 0) + 1,
    successRate: Math.round((winnedGames / totalGames) * 100),
  };
};
export const getDayBegin = (day: number) => {
  const epochMs = Date.UTC(2022, 0);
  const msInDay = 86400000;
  return new Date(epochMs + msInDay * day);
};
