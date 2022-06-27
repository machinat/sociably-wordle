import type { MessengerEventContext } from '@sociably/messenger';
import type MessengerAuth from '@sociably/messenger/webview';
import type { TwitterEventContext } from '@sociably/twitter';
import type TwitterAuth from '@sociably/twitter/webview';
import type { TelegramEventContext } from '@sociably/telegram';
import type TelegramAuth from '@sociably/telegram/webview';
import type { LineEventContext } from '@sociably/line';
import type LineAuth from '@sociably/line/webview';
import type { WebviewEventContext } from '@sociably/webview';
import { CharStatus } from './constants';

export type ChatEventContext =
  | MessengerEventContext
  | TwitterEventContext
  | TelegramEventContext
  | LineEventContext;

export type WebAppEventContext = WebviewEventContext<
  MessengerAuth | TwitterAuth | TelegramAuth | LineAuth
>;

export type GameChannel = NonNullable<ChatEventContext['event']['channel']>;

export type NotifyEventContext = {
  platform: ChatEventContext['platform'];
  event: {
    platform: ChatEventContext['platform'];
    category: 'app';
    type: 'notify';
    payload: null;
    channel: GameChannel;
    user: null;
  };
};

export type SocialPostEventContext = {
  platform: 'app';
  event: {
    platform: 'app';
    category: 'app';
    type: 'social_post';
    payload: null;
    channel: null;
    user: null;
  };
};

export type AppEventContext =
  | ChatEventContext
  | WebAppEventContext
  | NotifyEventContext
  | SocialPostEventContext;

export type GameStats = {
  totalWinTime: number;
  winCounts: number[];
  failCount: number;
  currentStreak: number;
  bestStreak: number;
};

export type GameState = {
  game: {
    start?: number;
    end?: number;
    guesses: string[];
  };
  stats: GameStats;
  settings: {
    timezone: number;
    notifHour?: number;
  };
  interactAt: number;
  messengerOneTimeNotifToken?: string;
};

export type GameData = {
  day: number;
  finishTime?: number;
  answer: string;
  results: CharStatus[][];
  guesses: string[];
  stats: GameStats;
};
