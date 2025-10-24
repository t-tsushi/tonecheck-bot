import axios from "axios";

export async function suggestRewrite(text, lang = "ja", toneCategory = "適切") {
  let instruction;

  if (lang === "ja") {
    if (toneCategory === "不適切") {
      instruction = "文章をポジティブかつ適切な内容に書き換えてください。";
    } else if (toneCategory === "攻撃的") {
      instruction = "文章をポジティブで、受け手に優しさが伝わるように適切な内容に書き換えてください。";
    } else if (toneCategory === "曖昧") {
      instruction = "文章の論理構成を見直し、伝えたい内容が受け手に伝わりやすいように書き換えてください。";
    } else {
      instruction = "文章の誤字脱字を修正してください。";
    }
  } else {
    if (toneCategory === "不適切") {
      instruction = "Rewrite the text to be positive and appropriate for a business context.";
    } else if (toneCategory === "攻撃的") {
      instruction = "Rewrite the text to be positive and gentle so that kindness is conveyed.";
    } else if (toneCategory === "曖昧") {
      instruction = "Rewrite the text to improve its logical structure so that the intended message is clear to the reader.";
    } else {
      instruction = "Fix any typos or grammatical errors in the text.";
    }
  }

  const prompt = `${instruction}\n\n元の文: ${text}`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (e) {
    return "（リライト提案の生成に失敗しました）";
  }
}
