import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient, { useEventReducer } from '@machinat/webview/client';
import MessengerWebviewAuth from '@machinat/messenger/webview/client';
import TwitterWebviewAuth from '@machinat/twitter/webview/client';
import TelegramWebviewAuth from '@machinat/telegram/webview/client';
import LineWebviewAuth from '@machinat/line/webview/client';
import { AlertProvider } from '../context/AlertContext';
import App from '../components/App';
import type { GameData } from '../../src/types';

const { publicRuntimeConfig } = getConfig();

const client = new WebviewClient({
  mockupMode: typeof window === 'undefined',
  authPlatforms: [
    new MessengerWebviewAuth({
      pageId: publicRuntimeConfig.messengerPageId,
    }),
    new TwitterWebviewAuth({
      agentId: publicRuntimeConfig.twitterAgentId,
    }),
    new TelegramWebviewAuth({
      botName: publicRuntimeConfig.telegramBotName,
    }),
    new LineWebviewAuth({
      liffId: publicRuntimeConfig.lineLiffId,
    }),
  ],
});

const WebAppHome = () => {
  const data = useEventReducer<null | GameData>(
    client,
    (currentData, { event }) => {
      console.log(event);
      if (event.type === 'data' || event.type === 'guess_result') {
        const newData = event.payload;
        return newData;
      }
      return currentData;
    },
    null
  );

  return (
    <React.StrictMode>
      <Head>
        <title>Machinat Webview</title>
      </Head>

      <AlertProvider>
        <App client={client} data={data} />
      </AlertProvider>
    </React.StrictMode>
  );
};

// to activate publicRuntimeConfig
export const getServerSideProps = () => ({ props: {} });
export default WebAppHome;
