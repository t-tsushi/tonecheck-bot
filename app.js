import pkg from '@slack/bolt';
const { App } = pkg;
import { analyzeSentiment } from './services/sentiment.js';
import { suggestRewrite } from './services/rewriter.js';

function detectLang(text) {
  return /[\u3040-\u30ff\u4e00-\u9faf]/.test(text) ? 'ja' : 'en';
}

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.command('/check', async ({ ack, body, client }) => {
  await ack();
  const text = body.text || '';
  const lang = detectLang(text);
  const sentiment = await analyzeSentiment(text, lang);
  const score = sentiment.score;
  let toneCategory;
  if (score < -0.3) {
    toneCategory = '攻撃的';
  } else if (score < 0) {
    toneCategory = '攻撃的かつ曖昧';
  } else if (score < 0.1) {
    toneCategory = '曖昧';
  } else {
    toneCategory = '適切';
  }
  const rewrite = await suggestRewrite(text, lang, toneCategory);
  const message =
    `🧠 ToneCheck結果\n` +
    `・言語: ${lang}\n` +
    `・トーン分類: ${toneCategory}\n\n` +
    `📄 元の文章:\n${text}\n\n` +
    `💡 提案された文章:\n${rewrite}`;

  await client.chat.postMessage({
    channel: body.channel_id,
    text: message,
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();