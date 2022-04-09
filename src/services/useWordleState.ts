import {
  makeFactoryProvider,
  StateController,
  MachinatChannel,
} from '@machinat/core';
import { getWordOfDay, getDayIndex } from '../utils';
import { MAX_CHALLENGES } from '../constants';
import { GameState } from '../types';

const WORDLE_STATE_KEY = 'game_data';

const useWordleState =
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
        state = {
          guesses: [],
          stats: {
            totalWinTime: 0,
            failCount: 0,
            bestStreak: 0,
            currentStreak: 0,
            winCounts: new Array(MAX_CHALLENGES).fill(0),
          },
        }
      ) => {
        const lastGameDay = state.start ? getDayIndex(state.start) : undefined;

        if (!guess) {
          if (lastGameDay !== today) {
            return {
              guesses: [],
              stats: state.stats,
            };
          }
          return state;
        }

        const isNewGame = lastGameDay !== today && guessDay === today;
        const start = isNewGame ? now : state.start || now;
        const guesses = isNewGame ? [] : state.guesses;
        if (guesses.length >= MAX_CHALLENGES || (!isNewGame && state.end)) {
          return state;
        }

        const isWinned = guess === answer;
        const guessCount = guesses.length + 1;
        const isLosed = guessCount === MAX_CHALLENGES;

        const stats = { ...state.stats };
        if (isWinned) {
          stats.winCounts[guessCount - 1] += 1;
          stats.currentStreak += 1;
          stats.bestStreak = Math.max(stats.currentStreak, stats.bestStreak);
          stats.totalWinTime = state.stats.totalWinTime + now - start;
        } else if (isLosed) {
          stats.currentStreak = 0;
          stats.failCount + 1;
        }

        return {
          start,
          end: isWinned ? now : undefined,
          guesses: [...guesses, guess],
          stats,
        };
      }
    );

    return [answer, state];
  };

export default makeFactoryProvider({
  deps: [StateController],
})(useWordleState);
