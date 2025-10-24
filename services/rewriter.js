import axios from "axios";

export async function suggestRewrite(text, lang = "ja") {
  const instruction = lang === "ja"
    ? "丁寧で建設的な表現に言い換えてください。"
    : "Rewrite politely and constructively.";
  const prompt = `${instruction}\n元の文: ${text}`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    return response.data.choices[0].message.content.trim();
  } catch (e) {
    return "（リライト提案の生成に失敗しました）";
  }
}
