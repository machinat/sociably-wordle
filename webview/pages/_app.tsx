import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import getConfig from 'next/config';
import { useEventReducer, useClient } from '@machinat/webview/client';
import MessengerWebviewAuth from '@machinat/messenger/webview/client';
import TwitterWebviewAuth from '@machinat/twitter/webview/client';
import TelegramWebviewAuth from '@machinat/telegram/webview/client';
import LineWebviewAuth from '@machinat/line/webview/client';
import { AlertProvider } from '../context/AlertContext';
import type { GameData } from '../../src/types';
import '../index.css';

const {
  publicRuntimeConfig: {
    messengerPageId,
    twitterAgentId,
    telegramBotName,
    lineLiffId,
  },
} = getConfig();

const WordleApp = ({ Component, pageProps }) => {
  const client = useClient({
    mockupMode: typeof window === 'undefined',
    authPlatforms: [
      new MessengerWebviewAuth({ pageId: messengerPageId }),
      new TwitterWebviewAuth({ agentId: twitterAgentId }),
      new TelegramWebviewAuth({ botName: telegramBotName }),
      new LineWebviewAuth({ liffId: lineLiffId }),
    ],
  });

  const data = useEventReducer<GameData | null>(
    client,
    (currentData, { event }) => {
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
        <title>Wordle Machina</title>
      </Head>

      <AlertProvider>
        <Component {...pageProps} client={client} data={data} />
      </AlertProvider>
    </React.StrictMode>
  );
};

// to activate publicRuntimeConfig
WordleApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default WordleApp;
