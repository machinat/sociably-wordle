import type { MessengerEventContext } from '@machinat/messenger';
import type MessengerWebviewAuth from '@machinat/messenger/webview';
import type { TwitterEventContext } from '@machinat/twitter';
import type TwitterWebviewAuth from '@machinat/twitter/webview';
import type { TelegramEventContext } from '@machinat/telegram';
import type TelegramWebviewAuth from '@machinat/telegram/webview';
import type { LineEventContext } from '@machinat/line';
import type LineWebviewAuth from '@machinat/line/webview';
import type { WebviewEventContext } from '@machinat/webview';

export type ChatEventContext =
  | MessengerEventContext
  | TwitterEventContext
  | TelegramEventContext
  | LineEventContext;

export type WebAppEventContext = WebviewEventContext<
  | MessengerWebviewAuth
  | TwitterWebviewAuth
  | TelegramWebviewAuth
  | LineWebviewAuth
>;

export type AppEventContext = ChatEventContext | WebAppEventContext;
