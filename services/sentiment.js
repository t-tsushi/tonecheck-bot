import axios from "axios";

export async function analyzeSentiment(text, lang = "ja") {
  const prompt = `
あなたはメッセージのトーンを評価します。
出力形式: JSON {"score": -1〜1, "tone": "positive|neutral|negative"}。
対象文: ${text}
`;
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed;
  } catch (e) {
    return { score: 0, tone: "neutral" };
  }
}
