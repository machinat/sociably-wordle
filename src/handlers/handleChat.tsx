import Machinat, { makeContainer } from '@machinat/core';
import About from '../scenes/About';
import WithMenu from '../components/WithMenu';
import Statistics from '../components/Statistics';
import ShareGame from '../components/ShareGame';
import useIntent from '../services/useIntent';
import useUserProfile from '../services/useUserProfile';
import useWordleState from '../services/useWordleState';
import { ChatEventContext } from '../types';

const handleChat = makeContainer({
  deps: [useIntent, useUserProfile, useWordleState],
})(
  (getIntent, getUserProfile, getWordleState) =>
    async (
      ctx: ChatEventContext & { event: { category: 'message' | 'postback' } }
    ) => {
      const { event, reply } = ctx;
      if (!event.channel) {
        return;
      }
      const intent = await getIntent(event);
      const [answer, state] = await getWordleState(event.channel);
      const isFinishedToday = !!state.end;

      if (intent.type === 'about') {
        return reply(<About.Start />);
      }

      if (intent.type === 'share') {
        return reply(
          isFinishedToday ? (
            <ShareGame
              answer={answer}
              finishTime={state.end && state.start && state.end - state.start}
              guesses={state.guesses}
            />
          ) : (
            <WithMenu>You haven't finished today's game!</WithMenu>
          )
        );
      }

      if (intent.type === 'stats') {
        return reply(<Statistics gameStats={state.stats} />);
      }

      const profile = await getUserProfile(event.user);
      const greeting =
        intent.type === 'greeting'
          ? `Hello${profile ? `, ${profile.name}` : ''}! `
          : '';
      return reply(
        isFinishedToday ? (
          <WithMenu gameFinished>
            {greeting}You've finished today's game!
          </WithMenu>
        ) : (
          <WithMenu>{greeting}Play today's Wordle!</WithMenu>
        )
      );
    }
);

export default handleChat;
