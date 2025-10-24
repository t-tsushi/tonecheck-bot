import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { analyzeSentiment } from "./services/sentiment.js";
import { suggestRewrite } from "./services/rewriter.js";
import { checkProfanity } from "./services/filter.js";

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
  const profanity = await checkProfanity(text);

  let message = `🧠 *ToneCheck結果*\n\n`;
  message += `・言語: ${lang}\n`;
  message += `・感情スコア: ${sentiment.score}\n`;
  message += `・トーン分類: ${sentiment.tone}\n`;

  if (profanity.length > 0) {
    message += `⚠️ 不適切語検出: ${profanity.join(", ")}\n`;
  }

  message += `💬 提案: ${rewrite}`;

  await say({
    text: message,
    mrkdwn: true
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡ ToneCheck Bot is running!");
})();
