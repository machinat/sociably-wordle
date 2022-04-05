import {
  makeFactoryProvider,
  StateController,
  MachinatChannel,
} from '@machinat/core';
import { getWordOfDay, getDayIndex } from '../utils';
import { MAX_CHALLENGES } from '../constants';
import { GameState } from '../types';

const WORDLE_STATE_KEY = 'game_data';

const useWordleGame =
  (stateController: StateController) =>
  async (
    channel: MachinatChannel,
    guessDay?: number,
    guess?: string
  ): Promise<[string, GameState]> => {
    const now = Date.now();
    const today = getDayIndex(now);
    const answer = getWordOfDay(guessDay || today);

    const state = await stateController.channelState(channel).update<GameState>(
      WORDLE_STATE_KEY,
      (
        currentState = {
          guesses: [],
          history: {
            totalWinTime: 0,
            failCount: 0,
            winCounts: new Array(MAX_CHALLENGES).fill(0),
          },
        }
      ) => {
        const lastGameDay = currentState.start
          ? getDayIndex(currentState.start)
          : undefined;

        if (!guess) {
          if (lastGameDay !== today) {
            return {
              guesses: [],
              history: currentState.history,
            };
          }
          return currentState;
        }

        const isNewGame = lastGameDay !== today && guessDay === today;
        const guesses = isNewGame ? [] : currentState.guesses;
        const start = isNewGame ? now : currentState.start || now;
        if (guesses.length >= MAX_CHALLENGES) {
          return {
            ...currentState,
            stat: {
              ...currentState.history,
              failCount: currentState.history.failCount + 1,
            },
          };
        }

        const isFinished = guess === answer;
        const newGuesses = [...guesses, guess];
        const winCounts = [...currentState.history.winCounts];
        if (isFinished) {
          winCounts[newGuesses.length - 1] += 1;
        }
        return {
          start,
          end: isFinished ? now : undefined,
          guesses: newGuesses,
          history: isFinished
            ? {
                ...currentState.history,
                winCounts,
                totalWinTime: currentState.history.totalWinTime + now - start,
              }
            : currentState.history,
        };
      }
    );

    return [answer, state];
  };

export default makeFactoryProvider({
  deps: [StateController],
})(useWordleGame);
