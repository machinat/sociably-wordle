import React from 'react';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import WebviewClient from '@machinat/webview/client';
import { useState, useEffect } from 'react';
import { Grid } from '../components/grid/Grid';
import { Keyboard } from '../components/keyboard/Keyboard';
import { InfoModal } from '../components/modals/InfoModal';
import { StatsModal } from '../components/modals/StatsModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
} from '../strings';
import {
  MAX_WORD_LENGTH,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  GAME_LOST_INFO_DELAY,
} from '../settings';
import type { GameData } from '../../src/types';
import {
  isWordInWordList,
  findFirstUnusedReveal,
  unicodeLength,
} from '../utils/words';
import {
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
} from '../utils/localStorage';
import { AlertContainer } from '../components/alerts/AlertContainer';
import { useAlert } from '../context/AlertContext';
import { Navbar } from '../components/navbar/Navbar';

type PageProps = {
  data: GameData | null;
  client: WebviewClient<any, any>;
};

const WrodleGame = ({ data, client }: PageProps) => {
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isWaitingResult, setIsWaitingResult] = useState(false);
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert();

  useEffect(() => {
    if (isWaitingResult) {
      setIsWaitingResult(false);
      setCurrentGuess('');
      setIsRevealing(true);
      // turn this back off after all
      // chars have been revealed
      setTimeout(() => {
        setIsRevealing(false);
      }, REVEAL_TIME_MS * MAX_WORD_LENGTH);
    }
    if (data?.finishTime) {
      setIsGameWon(true);
    } else if (data?.guesses.length === MAX_CHALLENGES) {
      setIsGameLost(true);
      if (data?.answer) {
        showErrorAlert(CORRECT_WORD_MESSAGE(data.answer), {
          persist: true,
          delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1,
        });
      }
    }
  }, [data]);

  const guesses = data?.guesses || [];
  const results = data?.results || [];

  const prefersDarkMode =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : null;

  const [currentGuess, setCurrentGuess] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window === 'undefined'
      ? !!prefersDarkMode
      : localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : !!prefersDarkMode
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  );
  const [isRevealing, setIsRevealing] = useState(false);
  const [isHardMode, setIsHardMode] = useState(
    typeof window === 'undefined'
      ? false
      : localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isDarkMode, isHighContrastMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard);
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal');
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE);
    }
  };

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast);
    setStoredIsHighContrastMode(isHighContrast);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass('');
  };

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH;

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      });
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, GAME_LOST_INFO_DELAY);
    }
  }, [isGameWon, isGameLost, showSuccessAlert]);

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    );
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle');
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle');
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode && guesses.length > 0) {
      const firstMissingReveal = findFirstUnusedReveal(
        currentGuess,
        guesses[guesses.length - 1],
        results[results.length - 1]
      );
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle');
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        });
      }
    }

    if (
      data &&
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      client.send({
        category: 'game',
        type: 'guess',
        payload: {
          day: data.day,
          guess: currentGuess,
        },
      });
      setIsWaitingResult(true);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
        <div className="pb-6 grow">
          <Grid
            guesses={guesses}
            results={results}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            currentRowClassName={currentRowClass}
          />
        </div>
        <Keyboard
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          guesses={guesses}
          results={results}
          isRevealing={isRevealing}
        />
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <StatsModal
          day={data?.day || 0}
          finishTime={data?.finishTime || 0}
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          results={results}
          history={data?.history || null}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          isHardMode={isHardMode}
          isDarkMode={isDarkMode}
          isHighContrastMode={isHighContrastMode}
          numberOfGuessesMade={guesses.length}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isHardMode={isHardMode}
          handleHardMode={handleHardMode}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <AlertContainer />
      </div>
    </div>
  );
};

export default WrodleGame;
