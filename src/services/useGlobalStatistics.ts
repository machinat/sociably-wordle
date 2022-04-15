import { makeFactoryProvider, StateController } from '@machinat/core';
import { MAX_CHALLENGES } from '../constants';

const GLOBAL_STATS_KEY = 'global_stats';

type ResultInput =
  | { isWinned: false }
  | {
      isWinned: true;
      guessCount: number;
      time: number;
    };

type GlobalStats = {
  totalWinTime: number;
  winCounts: number[];
  failCount: number;
};

const DEFAULT_STATS: GlobalStats = {
  winCounts: new Array(MAX_CHALLENGES).fill(0),
  failCount: 0,
  totalWinTime: 0,
};

const useGlobalStatistics =
  (stateController: StateController) =>
  async (date: Date, result?: ResultInput): Promise<GlobalStats> => {
    const absoulteDay = Math.round(date.getTime() / 86400000);

    const updatedStats = await stateController
      .globalState(GLOBAL_STATS_KEY)
      .update<GlobalStats>(absoulteDay.toString(), (currentStats) => {
        if (!result) {
          return currentStats;
        }

        const stats = currentStats || DEFAULT_STATS;

        if (!result.isWinned) {
          return { ...stats, failCount: stats.failCount + 1 };
        }

        const { guessCount, time } = result;
        const winCounts = [...stats.winCounts];
        if (guessCount > 0 && guessCount <= MAX_CHALLENGES) {
          winCounts[guessCount - 1] += 1;
        }

        return {
          ...stats,
          winCounts,
          totalWinTime: stats.totalWinTime + time,
        };
      });

    return updatedStats || DEFAULT_STATS;
  };

export default makeFactoryProvider({
  deps: [StateController],
})(useGlobalStatistics);
