const ngWords = ["ばか", "くそ", "fuck", "idiot", "死ね"];

export async function checkProfanity(text) {
  const hits = ngWords.filter((word) => text.includes(word));
  return hits;
}
