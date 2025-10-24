const { App } = require('@slack/bolt');
const axios = require('axios');
const { detectLang, analyzeSentiment } = require('./services/analysis');
const { suggestRewrite } = require('./services/rewriter');

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

app.command('/check', async ({ command, ack, say }) => {
  await ack();
  const text = command.text;
  const lang = detectLang(text);
  const sentiment = await analyzeSentiment(text, lang);
  let toneCategory;
  const score = sentiment.score;
  if (score < -0.4) {
    toneCategory = '攻撃的';
  } else if (score < -0.1) {
    toneCategory = '攻撃的かつ曖昧';
  } else if (score < 0.1) {
    toneCategory = '曖昧';
  } else {
    toneCategory = '適切';
  }
  const rewrite = await suggestRewrite(text, lang, toneCategory);
  let message = `🧠 *ToneCheck結果*  \n\n`;
  message += `・言語: ${lang}  \n`;
  message += `・トーン分類: ${toneCategory}  \n\n`;
  message += `📄 元の文章:  \n${text}  \n\n`;
  message += `💡 提案された文章:  \n${rewrite}`;
  await say({
    text: message,
    mrkdwn: true,
  });
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
