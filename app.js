import pkg from "@slack/bolt";
const { App } = pkg;
import dotenv from "dotenv";
import { analyzeSentiment } from "./services/sentiment.js";
import { suggestRewrite } from "./services/rewriter.js";

// Load environment variables
dotenv.config();

// Simple language detection: Japanese if contains Japanese characters, else English
function detectLang(text) {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text) ? 'ja' : 'en';
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false
});

// Handle the /check command
app.command("/check", async ({ command, ack, say }) => {
  await ack();
  const text = command.text;
  const lang = detectLang(text);
  const sentiment = await analyzeSentiment(text, lang);
  const rewrite = await suggestRewrite(text, lang);

  let toneCategory;
  const score = sentiment.score;
  if (score < -0.5) {
    toneCategory = '不適切';
  } else if (score < -0.1) {
    toneCategory = 'アグレッシブ';
  } else if (score < 0.1) {
    toneCategory = '曖昧';
  } else {
    toneCategory = '適切';
  }

  let message = `🧠 *ToneCheck結果*\n\n`;
  message += `・言語: ${lang}\n`;
  message += `・トーン分類: ${toneCategory}\n\n`;
  message += `📄 元の文章:\n${text}\n\n`;
  message += `💡 提案された文章:\n${rewrite}`;

  await say({
    text: message,
    mrkdwn: true
  });
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡ ToneCheck Bot is running!");
})();
