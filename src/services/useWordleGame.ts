import { makeFactoryProvider, SociablyChannel } from '@sociably/core';
import { getWordOfDay, getDayIndex } from '../utils';
import { MAX_CHALLENGES } from '../constants';
import { GameState } from '../types';
import useWordleState from './useWordleState';

export default makeFactoryProvider({
  deps: [useWordleState],
})(
  (updateWordleState) =>
    async (
      channel: SociablyChannel,
      day: number,
      guess: string
    ): Promise<{ answer: string; state: GameState }> => {
      const now = Date.now();
      const answer = getWordOfDay(day);

      const { state } = await updateWordleState(
        channel,
        {},
        (currentState): GameState => {
          const {
            game,
            settings: { timezone },
          } = currentState;
          const today = getDayIndex(timezone, now);
          const lastGameDay = game.start
            ? getDayIndex(timezone, game.start)
            : undefined;

          if (day !== lastGameDay && day !== today) {
            return currentState;
          }

          const isNewGame = lastGameDay !== today && day === today;
          const start = isNewGame ? now : game.start || now;
          const guesses = isNewGame ? [] : game.guesses;

          if (guesses.length >= MAX_CHALLENGES || (!isNewGame && game.end)) {
            return currentState;
          }

          const isWinned = guess === answer;
          const guessCount = guesses.length + 1;
          const isLosed = guessCount === MAX_CHALLENGES;

          const nextStats = { ...currentState.stats };
          if (isWinned) {
            nextStats.winCounts[guessCount - 1] += 1;
            nextStats.currentStreak += 1;
            nextStats.bestStreak = Math.max(
              nextStats.currentStreak,
              nextStats.bestStreak
            );
            nextStats.totalWinTime = nextStats.totalWinTime + now - start;
          } else if (isLosed) {
            nextStats.currentStreak = 0;
            nextStats.failCount + 1;
          }

          return {
            ...currentState,
            game: {
              start,
              end: isWinned ? now : undefined,
              guesses: [...guesses, guess],
            },
            stats: nextStats,
          };
        }
      );

      return { answer, state };
    }
);
