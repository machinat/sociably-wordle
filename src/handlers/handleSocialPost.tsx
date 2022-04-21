import Machinat, { makeContainer } from '@machinat/core';
import Twitter from '@machinat/twitter';
import Telegram from '@machinat/telegram';
import SocialPost from '../components/SocialPost';
import useGlobalStatistics from '../services/useGlobalStatistics';
import { AGENT_TAG_NAME } from '../constants';
import { getWordOfDay, getDayIndex } from '../utils';

const handleWebview = makeContainer({
  deps: [useGlobalStatistics, Twitter.Bot, Telegram.Bot],
})((getGlobalStatistics, twitterBot, telegramBot) => async () => {
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayIdx = getDayIndex(0, yesterday.getTime());
  const wordOfYesterday = getWordOfDay(yesterdayIdx);

  const { failCount, winCounts, totalWinTime } = await getGlobalStatistics(
    yesterdayIdx
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
  await telegramBot.render(`@${AGENT_TAG_NAME}`, socialPost);
});

export default handleWebview;
