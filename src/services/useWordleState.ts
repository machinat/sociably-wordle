import {
  makeFactoryProvider,
  StateController,
  SociablyChannel,
} from '@sociably/core';
import { getDayIndex } from '../utils';
import { MAX_CHALLENGES } from '../constants';
import { GameState } from '../types';

const WORDLE_STATE_KEY = 'game_data';

type UpdateOptions = {
  updateDay?: boolean;
  updateTimezone?: number;
  updateInteractTime?: boolean;
};

const useWordleState =
  (stateController: StateController) =>
  async (
    channel: SociablyChannel,
    { updateDay, updateTimezone, updateInteractTime }: UpdateOptions = {},
    updator: (state: GameState) => GameState = (x) => x
  ): Promise<{
    state: GameState;
    isTimezoneChanged: boolean;
    isDayChanged: boolean;
  }> => {
    let isTimezoneChanged = false;
    let isDayChanged = false;

    const updatedState = await stateController
      .channelState(channel)
      .update<GameState>(
        WORDLE_STATE_KEY,
        (
          currentState = {
            game: { guesses: [] },
            stats: {
              totalWinTime: 0,
              failCount: 0,
              bestStreak: 0,
              currentStreak: 0,
              winCounts: new Array(MAX_CHALLENGES).fill(0),
            },
            settings: {
              timezone: 0,
            },
            interactAt: Date.now(),
          }
        ): GameState => {
          let state = updateInteractTime
            ? { ...currentState, interactAt: Date.now() }
            : currentState;

          if (
            typeof updateTimezone === 'number' &&
            updateTimezone !== currentState.settings.timezone
          ) {
            isTimezoneChanged = true;
            state = {
              ...currentState,
              settings: {
                ...currentState.settings,
                timezone: updateTimezone,
              },
            };
          }

          if (!updateDay) {
            return updator(state);
          }

          const { game } = state;
          const timezone = state.settings.timezone;
          const today = getDayIndex(timezone, Date.now());
          const lastGameDay = game.start
            ? getDayIndex(timezone, game.start)
            : undefined;

          if (lastGameDay && lastGameDay !== today) {
            isDayChanged = true;
            return updator({ ...state, game: { guesses: [] } });
          }

          return updator(state);
        }
      );

    return { state: updatedState, isTimezoneChanged, isDayChanged };
  };

export default makeFactoryProvider({
  deps: [StateController],
})(useWordleState);
