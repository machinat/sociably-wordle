import Machinat from '@machinat/core';
import * as Twitter from '@machinat/twitter/components';
import * as Telegram from '@machinat/telegram/components';
import { formatTime } from '../utils';
import {
  MESSENGER_PAGE_ID,
  TELEGRAM_BOT_NAME,
  LINE_ACCOUNT_ID,
} from '../constants';

type SocialPostProps = {
  answer: string;
  date: Date;
  winCounts: number[];
  failCount: number;
  totalWinTime: number;
};

const SPECIAL_CHAR_SET = 0x1d5d4;

const getSpecialWord = (word: string) => {
  let boldWord = '';
  for (const char of word.toLowerCase()) {
    const charNum = char.charCodeAt(0) - 97; // 'a'
    boldWord += String.fromCodePoint(SPECIAL_CHAR_SET + charNum);
  }
  return boldWord;
};

const getRatioBar = (count: number, maxCount: number, total: number) => {
  if (!count || !total) {
    return ' 0%';
  }
  const len = Math.round((count / maxCount) * 8);
  return `${new Array(len).fill('🟩').join('')} ${Math.round(
    (count / total) * 100
  )}%`;
};

const SocialPost = (
  { answer, date, winCounts, failCount, totalWinTime }: SocialPostProps,
  { platform }
) => {
  const answerDesc = (
    <>
      The word of {date.getUTCMonth() + 1}/{date.getUTCDate()} is:
      <br />
      <br />
      {getSpecialWord(answer)}
      <br />
    </>
  );

  const winnedGames = winCounts.reduce((sum, c) => sum + c, 0);
  const totalGames = winnedGames + failCount;
  const winRate = totalGames !== 0 ? winnedGames / totalGames : 0;
  const avgTime = winnedGames !== 0 ? totalWinTime / winnedGames : 0;
  const avgGuesses =
    winnedGames !== 0
      ? winCounts.reduce((sum, count, i) => sum + count * (i + 1), 0) /
        winnedGames
      : 0;

  const statistics =
    // prettier-ignore
    <>
      🏁 Played games: {totalGames}<br />
      🏅 Win Rate: {Math.round(winRate * 100)}%<br />
      🔠 Avg. Guesses: {avgGuesses.toFixed(1)}<br />
      ⏲ Avg. Win Time: {formatTime(avgTime)}<br />
    </>;

  const maxCount = Math.max(...winCounts, failCount);
  const gussesDistribution =
    winCounts
      .map((count, i) => {
        return `${i + 1}: ${getRatioBar(count, maxCount, totalGames)}\n`;
      })
      .join('') + `X: ${getRatioBar(failCount, maxCount, totalGames)}\n`;

  if (platform === 'twitter') {
    return (
      <>
        <Twitter.Tweet directMessageLink={{ text: 'Play' }}>
          {answerDesc}
          <br />
          {statistics}
          <br />
          Message me to play 👇
        </Twitter.Tweet>
        <p>
          Guess Distribution:
          <br />
          <br />
          {gussesDistribution}
        </p>
        <p>
          You can also find me at:
          <br />
          <br />
          💬 Messenger https://m.me/{MESSENGER_PAGE_ID}
          <br />
          💬 Telegram https://t.me/{TELEGRAM_BOT_NAME}
          <br />
          💬 LINE https://line.me/R/ti/p/{LINE_ACCOUNT_ID}
        </p>
      </>
    );
  }

  if (platform === 'telegram') {
    return (
      <>
        <p>
          {answerDesc}
          <br />
          {statistics}
        </p>
        <p>
          Guess Distribution:
          <br />
          <br />
          {gussesDistribution}
        </p>
        <Telegram.Text
          replyMarkup={
            <Telegram.InlineKeyboard>
              <Telegram.UrlButton
                text="Play Wordle 🔤"
                url={`https://t.me/${TELEGRAM_BOT_NAME}`}
              />
            </Telegram.InlineKeyboard>
          }
        >
          Play today's game here 👇
        </Telegram.Text>
      </>
    );
  }

  return (
    <p>
      {answerDesc}
      <br />
      {statistics}
    </p>
  );
};

export default SocialPost;
