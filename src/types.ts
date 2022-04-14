import type { MessengerEventContext, MessengerChat } from '@machinat/messenger';
import type MessengerAuth from '@machinat/messenger/webview';
import type { TwitterEventContext, TwitterChat } from '@machinat/twitter';
import type TwitterAuth from '@machinat/twitter/webview';
import type { TelegramEventContext, TelegramChat } from '@machinat/telegram';
import type TelegramAuth from '@machinat/telegram/webview';
import type { LineEventContext, LineChat } from '@machinat/line';
import type LineAuth from '@machinat/line/webview';
import type { WebviewEventContext } from '@machinat/webview';
import { CharStatus } from './constants';

export type ChatEventContext =
  | MessengerEventContext
  | TwitterEventContext
  | TelegramEventContext
  | LineEventContext;

export type WebAppEventContext = WebviewEventContext<
  MessengerAuth | TwitterAuth | TelegramAuth | LineAuth
>;

export type GameChannel =NonNullable<ChatEventContext['event']['channel']>

export type NotifyEventContext = {
  platform: ChatEventContext['platform']
  event: {
    platform: ChatEventContext['platform']
    category: 'app',
    type: 'notify',
    payload: null,
    channel: GameChannel,
    user: null
  }
}

export type AppEventContext = ChatEventContext | WebAppEventContext | NotifyEventContext;


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
};

export type GameData = {
  day: number;
  finishTime?: number;
  answer: string;
  results: CharStatus[][];
  guesses: string[];
  stats: GameStats;
};
