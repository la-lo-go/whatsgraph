export interface WhatsAppMessages {
    sender: string;
    sender_slug: string;
    messages: {
        message: string;
        date: Date;
    }[];
}

interface Message {
    sender: string;
    message: string;
    date: Date;
}

export function ParseWhatsAppMessages(input: string): WhatsAppMessages[] {
    const messages: Message[] = [];
    const messageRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})(?:\s-\s|\s–\s)(.*?):\s(.*)$/gm;
    let match;

    while ((match = messageRegex.exec(input)) !== null) {
        const [_, date, time, sender, message] = match;
        const formattedDate = formatDate(date, time);
        if (formattedDate) {
            messages.push({ sender, message, date: formattedDate });
        }
    }

    return groupMessagesBySender(messages);
}

function formatDate(date: string, time: string): Date | null {
    const [day, month, year] = date.split('/');
    const yyyy = year.length === 2 ? `20${year}` : year;
    const [hours, minutes] = time.split(':');
    
    const formattedDate = new Date(`${yyyy}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes}:00`);
    
    return isNaN(formattedDate.getTime()) ? null : formattedDate;
}

function groupMessagesBySender(messages: Message[]): WhatsAppMessages[] {
    const groupedMessages = new Map<string, WhatsAppMessages>();

    for (const message of messages) {
        if (!groupedMessages.has(message.sender)) {
            const slugged_sender = message.sender.replace(/\s/g, '_');
            groupedMessages.set(message.sender, { sender: message.sender, sender_slug: slugged_sender, messages: [] });
        }
        groupedMessages.get(message.sender)!.messages.push({
            message: message.message,
            date: message.date,
        });
    }

    return Array.from(groupedMessages.values());
}