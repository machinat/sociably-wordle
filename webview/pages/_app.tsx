import React, { useEffect } from 'react';
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
    MESSENGER_PAGE_ID,
    TWITTER_AGENT_ID,
    TELEGRAM_BOT_NAME,
    LINE_LIFF_ID,
  },
} = getConfig();

const WordleApp = ({ Component, pageProps }) => {
  const client = useClient({
    mockupMode: typeof window === 'undefined',
    authPlatforms: [
      new MessengerWebviewAuth({ pageId: MESSENGER_PAGE_ID }),
      new TwitterWebviewAuth({ agentId: TWITTER_AGENT_ID }),
      new TelegramWebviewAuth({ botName: TELEGRAM_BOT_NAME }),
      new LineWebviewAuth({ liffId: LINE_LIFF_ID }),
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

  useEffect(() => {
    client.send({
      category: 'app',
      type: 'start',
      payload: { timezone: -(new Date().getTimezoneOffset() / 60) },
    });
  }, [client]);

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
