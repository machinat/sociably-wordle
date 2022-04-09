import Machinat, { makeContainer, BasicBot } from '@machinat/core';
import useWordleState from '../services/useWordleState';
import GameSummary from '../components/GameSummary';
import { getGuessStatuses, getDayIndex } from '../utils';
import { WebAppEventContext, GameData } from '../types';
import { MAX_CHALLENGES } from '../constants';

const handleWebview = makeContainer({ deps: [useWordleState, BasicBot] })(
  (wordleGame, basicBot) => async (ctx: WebAppEventContext) => {
    const {
      event,
      bot,
      metadata: { auth },
    } = ctx;

    if (event.type === 'connect') {
      const [answer, { start, end, guesses, stats }] = await wordleGame(
        auth.channel
      );

      const gameData: GameData = {
        day: getDayIndex(start || Date.now()),
        finishTime: start && end ? end - start : undefined,
        results: guesses.map((guess) => getGuessStatuses(guess, answer)),
        guesses,
        stats,
      };

      await bot.send(event.channel, {
        category: 'game',
        type: 'data',
        payload: gameData,
      });
    } else if (event.type === 'guess') {
      const { day, guess } = event.payload;
      const [answer, { start, end, guesses, stats }] = await wordleGame(
        auth.channel,
        day,
        guess
      );

      const isFinished = end || guesses.length === MAX_CHALLENGES;
      const finishTime = start && end ? end - start : undefined;
      const gameData: GameData = {
        day,
        guesses,
        stats,
        finishTime,
        results: guesses.map((guess) => getGuessStatuses(guess, answer)),
        answer: isFinished ? answer : undefined,
      };

      await bot.send(event.channel, {
        category: 'game',
        type: 'guess_result',
        payload: gameData,
      });

      if (isFinished) {
        await basicBot.render(
          auth.channel,
          <GameSummary
            answer={answer}
            finishTime={finishTime}
            guesses={guesses}
          />
        );
      }
    }
  }
);

export default handleWebview;
