import Machinat, { makeContainer } from '@machinat/core';
import Twitter from '@machinat/twitter';
import Telegram from '@machinat/telegram';
import SocialPost from '../components/SocialPost';
import useGlobalStatistics from '../services/useGlobalStatistics';
import { getWordOfDay, getDayIndex } from '../utils';

const handleWebview = makeContainer({
  deps: [useGlobalStatistics, Twitter.Bot, Telegram.Bot],
})((getGlobalStatistics, twitterBot, telegramBot) => async () => {
  const yesterdayTime = Date.now() - 86400000;
  const wordOfYesterday = getWordOfDay(getDayIndex(0, yesterdayTime));

  const yesterday = new Date(yesterdayTime);
  const { failCount, winCounts, totalWinTime } = await getGlobalStatistics(
    yesterday
  );

  const socialPost = (
    <SocialPost
      date={yesterday}
      answer={wordOfYesterday}
      failCount={failCount}
      winCounts={winCounts}
      totalWinTime={totalWinTime}
    />
  );

  await twitterBot.renderTweet(null, socialPost);
  // await telegramBot.render(`@${}`, socialPost);
});

export default handleWebview;
