import { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export interface WordFrequency {
  word: string;
  frequency: number;
}

export interface TopWordsBySender {
  [senderSlug: string]: WordFrequency[];
}

interface DailyWordsBySender {
  [sender: string]: {
    [date: string]: number;
  };
}

const multimediaRegex = /[<>]/;
const wordRegex =
  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;

function extractWords(message: string): string[] {
  return message
    .replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4);
}

export function GetTopWordsBySender(
  messages: WhatsAppMessages[],
  limit = 10
): TopWordsBySender {
  const results: TopWordsBySender = {};

  messages.forEach((person) => {
    const wordCounts: Record<string, number> = {};

    person.messages.forEach((msg) => {
      if (!multimediaRegex.test(msg.message)) {
        const words = extractWords(msg.message);

        words.forEach((word) => {
          if (word) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        });
      }
    });

    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word, frequency]) => ({ word, frequency }));

    results[person.sender_slug] = topWords;
  });

  return results;
}

export function GetDailyWordsBySender(
  messages: WhatsAppMessages[]
): DailyWordsBySender {
  const results: DailyWordsBySender = {};

  messages.forEach((person) => {
    const wordCounts: Record<string, number> = {};
    person.messages.forEach((msg) => {
      const date = msg.date.toISOString().split('T')[0];

      if (!multimediaRegex.test(msg.message)) {
        const words = extractWords(msg.message);

        wordCounts[date] = (wordCounts[date] || 0) + words.length;
      }
    });

    results[person.sender_slug] = wordCounts;
  });

  return results;
}

export interface EmojiFrequency {
  emoji: string;
  frequency: number;
}

export interface TopEmojisBySender {
  [senderSlug: string]: EmojiFrequency[];
}

const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\p{Emoji_Modifier})?(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\p{Emoji_Modifier})?)*(?:\uFE0F)?/gu;

function extractEmojis(message: string): string[] {
  return Array.from(message.matchAll(emojiRegex), m => m[0]);
}

export function GetTopEmojisBySender(
  messages: WhatsAppMessages[],
  limit = 10
): TopEmojisBySender {
  const results: TopEmojisBySender = {};

  messages.forEach((person) => {
    const emojiCounts: Record<string, number> = {};

    person.messages.forEach((msg) => {
      if (!multimediaRegex.test(msg.message)) {
        const emojis = extractEmojis(msg.message);

        emojis.forEach((emoji) => {
          emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        });
      }
    });

    const topEmojis = Object.entries(emojiCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([emoji, frequency]) => ({ emoji, frequency }));

    results[person.sender_slug] = topEmojis;
  });

  return results;
}
