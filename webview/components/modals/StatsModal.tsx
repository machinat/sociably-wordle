import Countdown from 'react-countdown';
import { CharStatus } from '../../../src/constants';
import { GameStats } from '../../../src/types';
import { StatBar } from '../stats/StatBar';
import { Histogram } from '../stats/Histogram';
import { shareStatus } from '../../utils/share';
import { getDayBegin } from '../../utils/stats';
import { BaseModal } from './BaseModal';
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
} from '../../strings';

type Props = {
  day: number;
  finishTime: undefined | number;
  isOpen: boolean;
  handleClose: () => void;
  results: CharStatus[][];
  isGameLost: boolean;
  isGameWon: boolean;
  handleShareToClipboard: () => void;
  isHardMode: boolean;
  isDarkMode: boolean;
  isHighContrastMode: boolean;
  numberOfGuessesMade: number;
  gameStats?: GameStats;
};

export const StatsModal = ({
  day,
  finishTime,
  isOpen,
  handleClose,
  results,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  isHardMode,
  isDarkMode,
  isHighContrastMode,
  numberOfGuessesMade,
  gameStats = {
    winCounts: [],
    failCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalWinTime: 0,
  },
}: Props) => {
  const winnedGames = gameStats.winCounts.reduce((sum, c) => sum + c, 0);
  const totalGames = winnedGames + gameStats.failCount;

  if (totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats} />
      </BaseModal>
    );
  }

  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
      <h4 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram
        gameStats={gameStats}
        numberOfGuessesMade={numberOfGuessesMade}
      />
      {(isGameLost || isGameWon) && (
        <div className="mt-5 sm:mt-6 columns-2 dark:text-white">
          <div>
            <h5>{NEW_WORD_TEXT}</h5>
            <Countdown
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              date={getDayBegin(day + 1)}
              daysInHours={true}
            />
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => {
              shareStatus(
                day,
                finishTime,
                results,
                isGameLost,
                isHardMode,
                isDarkMode,
                isHighContrastMode,
                handleShareToClipboard
              );
            }}
          >
            {SHARE_TEXT}
          </button>
        </div>
      )}
    </BaseModal>
  );
};
