import { makeContainer } from '@machinat/core';
import useWordleGame from '../services/useWordleGame';
import { getGuessStatuses, getDayIndex } from '../utils';
import { WebAppEventContext, GameData } from '../types';
import { MAX_CHALLENGES } from '../constants';

const handleWebview = makeContainer({ deps: [useWordleGame] })(
  (wordleGame) => async (ctx: WebAppEventContext) => {
    const {
      event,
      bot,
      metadata: { auth },
    } = ctx;

    if (event.type === 'connect') {
      const [answer, { start, end, guesses, history }] = await wordleGame(
        auth.channel
      );

      const gameData: GameData = {
        day: getDayIndex(start || Date.now()),
        finishTime: start && end ? end - start : undefined,
        results: guesses.map((guess) => getGuessStatuses(guess, answer)),
        guesses,
        history,
      };

      await bot.send(event.channel, {
        category: 'game',
        type: 'data',
        payload: gameData,
      });
    } else if (event.type === 'guess') {
      const { day, guess } = event.payload;
      const [answer, { start, end, guesses, history }] = await wordleGame(
        auth.channel,
        day,
        guess
      );

      const gameData: GameData = {
        day,
        guesses,
        history,
        finishTime: start && end ? end - start : undefined,
        results: guesses.map((guess) => getGuessStatuses(guess, answer)),
        answer: end || guesses.length === MAX_CHALLENGES ? answer : undefined,
      };

      await bot.send(event.channel, {
        category: 'game',
        type: 'guess_result',
        payload: gameData,
      });
    }
  }
);

export default handleWebview;
