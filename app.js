import { App } from "@slack/bolt";
import dotenv from "dotenv";
import detectLang from "langdetect";
import { analyzeSentiment } from "./services/sentiment.js";
import { suggestRewrite } from "./services/rewriter.js";
import { checkProfanity } from "./services/filter.js";

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false
});

// /check コマンドで文章を解析
app.command("/check", async ({ command, ack, say }) => {
  await ack();

  const text = command.text;
  const lang = detectLang.detect(text) || "ja";

  // 感情分析
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
