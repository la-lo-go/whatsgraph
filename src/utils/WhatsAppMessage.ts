export interface WhatsAppMessages {
    sender: string;
    sender_slug: string;
    messages: {
        message: string;
        date: string;
        time: string;
    }[];
}

export function ParseWhatsAppMessages(input: string): WhatsAppMessages[] {
    const messages: { sender: string; message: string; date: string; time: string }[] = [];
    const lines = input.split('\n');

    const messageRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}), (\d{1,2}:\d{2}) - (.*?): (.*)$/;

    for (const line of lines) {
        const match = line.match(messageRegex);
        if (match) {
            const [_, date, time, sender, message] = match;
            const formattedDate = formatDate(date);
            messages.push({ date: formattedDate, time, sender: sender, message });
        }
    }

    return groupMessagesBySender(messages);
}

function formatDate(date: string): string {
    const [month, day, year] = date.split('/');
    const yy = year.length === 4 ? year.slice(2) : year;
    return `${yy}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function groupMessagesBySender(messages: { sender: string; message: string; date: string; time: string }[]): WhatsAppMessages[] {
    const groupedMessages = new Map<string, WhatsAppMessages>();

    for (const message of messages) {
        if (!groupedMessages.has(message.sender)) {
            const slugged_sender = message.sender.replace(/\s/g, '_');
            groupedMessages.set(message.sender, { sender: message.sender, sender_slug: slugged_sender, messages: [] });
        }
        groupedMessages.get(message.sender)!.messages.push({
            message: message.message,
            date: message.date,
            time: message.time,
        });
    }

    return Array.from(groupedMessages.values());
}