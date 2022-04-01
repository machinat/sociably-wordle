import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient, { useEventReducer } from '@machinat/webview/client';
import MessengerWebviewAuth from '@machinat/messenger/webview/client';
import TwitterWebviewAuth from '@machinat/twitter/webview/client';
import TelegramWebviewAuth from '@machinat/telegram/webview/client';
import LineWebviewAuth from '@machinat/line/webview/client';

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
  const [isButtonTapped, setButtonTapped] = React.useState(false);
  const { hello } = useEventReducer(
    client,
    (data: { hello?: string }, { event }): { hello?: string } => {
      if (event.type === 'hello') {
        return { hello: event.payload };
      }
      return data;
    },
    { hello: undefined }
  );

  const Button = ({ payload }) => (
    <button
      disabled={!client.isConnected}
      onClick={() => {
        client.send({ category: 'greeting', type: 'hello', payload });
        client.closeWebview();
        setButtonTapped(true);
      }}
    >
      {payload}
    </button>
  );

  return (
    <div>
      <Head>
        <title>Machinat Webview</title>
      </Head>

      <main>
        <h1>Hello In-Chat Webview!</h1>
        <p>
          Get started by editing <code>webview/pages/index.js</code>
        </p>

        <h3>{hello || 'connecting... '}</h3>
        <p>
          {isButtonTapped
            ? 'Great! Check the chatroom 👍'
            : client.isConnected
            ? 'Tap a button 👇'
            : ''}
        </p>
        <div>
          <Button payload="Foo" />
          <Button payload="Bar" />
        </div>
      </main>
    </div>
  );
};

// to activate publicRuntimeConfig
export const getServerSideProps = () => ({ props: {} });
export default WebAppHome;
