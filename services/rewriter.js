import axios from "axios";

export async function suggestRewrite(text, lang = "ja", toneCategory = "適切") {
  let instruction;
  if (lang === "ja") {
    if (toneCategory === "攻撃的") {
      instruction = "文章をポジティブで、受け手に優しさが伝わるように適切な内容に書き換えてください。";
    } else if (toneCategory === "攻撃的かつ曖昧") {
      instruction = "文章をポジティブで、受け手に優しさが伝わるように、伝えたい内容が受け手に伝わりやすいように書き換えてください。";
    } else if (toneCategory === "曖昧") {
      instruction = "文章の論理構成を見直し、伝えたい内容が受け手に伝わりやすいように書き換えてください。";
    } else {
      instruction = "文章の誤字脱字を修正してください。";
    }
  } else {
    if (toneCategory === "攻撃的") {
      instruction = "Rewrite the text to be positive and gentle so that kindness is conveyed.";
    } else if (toneCategory === "攻撃的かつ曖昧") {
      instruction = "Rewrite the text to be positive and gentle and make the intended message clear to the reader.";
    } else if (toneCategory === "曖昧") {
      instruction = "Rewrite the text to improve its logical structure so that the intended message is clear to the reader.";
    } else {
      instruction = "Correct any typos or grammatical errors in the text.";
    }
  }
  try {
    const response = await axios.post("http://localhost:8000/api/rewrite", {
      text,
      instruction,
    });
    return response.data.rewrittenText || text;
  } catch (error) {
    console.error("Rewrite error:", error);
    return text;
  }
}
