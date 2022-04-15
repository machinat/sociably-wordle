import Machinat, { makeContainer, BasicBot } from '@machinat/core';
import useWordleState from '../services/useWordleState';
import useWordleGame from '../services/useWordleGame';
import useGlobalStatistics from '../services/useGlobalStatistics';
import Timer from '../services/Timer';
import GameSummary from '../components/GameSummary';
import { getGuessStatuses, getDayIndex, getWordOfDay } from '../utils';
import { WebAppEventContext, GameData } from '../types';
import { MAX_CHALLENGES } from '../constants';

const handleWebview = makeContainer({
  deps: [useWordleGame, useWordleState, useGlobalStatistics, BasicBot, Timer],
})(
  (playGame, updateState, updateGlobalStatistics, basicBot, timer) =>
    async (ctx: WebAppEventContext) => {
      const {
        event,
        bot,
        metadata: { auth },
      } = ctx;

      if (event.type === 'start') {
        const chat = auth.channel;
        const timezoneInput = event.payload.timezone;
        const {
          state: { game, stats, settings },
          isTimezoneChanged,
        } = await updateState(chat, true, timezoneInput);

        if (typeof settings.notifHour === 'number' && isTimezoneChanged) {
          const registeredTime = await timer.getRegisteredTimer(chat);
          if (registeredTime) {
            await timer.registerTimer(chat, timezoneInput, settings.notifHour);
          }
        }

        const day = getDayIndex(settings.timezone, game.start || Date.now());
        const answer = getWordOfDay(day);
        const gameData: GameData = {
          day,
          finishTime:
            game.start && game.end ? game.end - game.start : undefined,
          results: game.guesses.map((guess) => getGuessStatuses(guess, answer)),
          guesses: game.guesses,
          stats,
          answer,
        };

        await bot.send(event.channel, {
          category: 'game',
          type: 'data',
          payload: gameData,
        });
      } else if (event.type === 'guess') {
        const { day, guess } = event.payload;
        const {
          answer,
          state: { game, stats },
        } = await playGame(auth.channel, day, guess);

        const isFinished = game.end || game.guesses.length === MAX_CHALLENGES;
        const finishTime =
          game.start && game.end ? game.end - game.start : undefined;
        const gameData: GameData = {
          day,
          guesses: game.guesses,
          stats,
          finishTime,
          results: game.guesses.map((guess) => getGuessStatuses(guess, answer)),
          answer,
        };

        await bot.send(event.channel, {
          category: 'game',
          type: 'guess_result',
          payload: gameData,
        });

        if (isFinished) {
          await updateGlobalStatistics(
            new Date(game.start || Date.now()),
            typeof finishTime === 'undefined'
              ? { isWinned: false }
              : {
                  isWinned: true,
                  time: finishTime,
                  guessCount: game.guesses.length,
                }
          );

          const notifyTimer = await timer.getRegisteredTimer(auth.channel);
          await basicBot.render(
            auth.channel,
            <GameSummary
              day={day}
              answer={answer}
              finishTime={finishTime}
              guesses={game.guesses}
              withNotifyButton={!notifyTimer}
            />
          );
        }
      }
    }
);

export default handleWebview;
