import axios from "axios";

export async function suggestRewrite(text, lang = "ja", toneCategory = "適切") {
  let instruction;
  if (lang === "ja") {
    if (toneCategory === "攻撃的") {
      instruction = "文章をポジティブかつ意図的に優しさが伝わるように適切な内容に書き換えてください。";
    } else if (toneCategory === "攻撃的かつ曖昧") {
      instruction = "文章の論理構成を見直し、伝えたい内容が受け手に伝わりやすいようにし、ポジティブかつ意図的に優しさが伝わるように適切な内容に書き換えてください。";
    } else if (toneCategory === "曖昧") {
      instruction = "文章の論理構成を見直し、伝えたい内容が受け手に伝わりやすいように適切な内容に書き換えてください。";
    } else {
      instruction = "文章の誤字脱字を修正してください。";
    }
  } else {
    if (toneCategory === "攻撃的") {
      instruction = "Rewrite the text to be positive and intentionally convey kindness.";
    } else if (toneCategory === "攻撃的かつ曖昧") {
      instruction = "Rewrite the text to improve its logical structure so that the intended message is clear to the reader, and make the tone positive and convey kindness.";
    } else if (toneCategory === "曖昧") {
      instruction = "Rewrite the text to improve its logical structure so that the intended message is clear to the reader.";
    } else {
      instruction = "Fix any typos or grammatical errors in the text.";
    }
  }

  const prompt = `${instruction}\n\n元の文:\n${text}`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that rewrites text according to instructions.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const choices = response.data.choices;
    if (choices && choices.length > 0) {
      return choices[0].message.content.trim();
    }
    return text;
  } catch (error) {
    console.error("Error rewriting text:", error);
    return text;
  }
}
