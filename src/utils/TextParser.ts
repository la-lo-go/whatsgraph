import { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export interface WordFrequency {
  word: string;
  frequency: number;
}

export interface TopWordsBySender {
  [senderSlug: string]: WordFrequency[];
}

export function GetTopWordsBySender(
  data: WhatsAppMessages[],
  limit = 10
): TopWordsBySender {
  const results: TopWordsBySender = {};

  data.forEach((person) => {
    const wordCounts: Record<string, number> = {};

    person.messages.forEach((msg) => {
      const regex = /[<>]/;
      if (!regex.test(msg.message)) {
        const words = msg.message
          .replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, "")
          .toLowerCase()
          .split(/\s+/)
          .filter(
            (word) =>
              word.length > 4 &&
              /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g.test(
                word
              )
          );

        words.forEach((word) => {
          if (word) {
            if (!wordCounts[word]) {
              wordCounts[word] = 0;
            }
            wordCounts[word]++;
          }
        });
      }
    });

    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => ({ word: entry[0], frequency: entry[1] }));

    results[person.sender_slug] = topWords;
  });

  return results;
}
