"use client";

import React, { useEffect, useState } from "react";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import ChartsDashboard from "@/components/ChartsDashboard";

export default function DemoPage() {
    const [messages, setMessages] = useState<WhatsAppMessages[] | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch("/demoText.txt");
            const text = await response.text();
            const parsedMessages = parseWhatsAppMessages(text);
            setMessages(parsedMessages);
        };

        fetchMessages();
    }, []);

    const parseWhatsAppMessages = (text: string): WhatsAppMessages[] => {
        return [
            {
                sender_slug: "example_sender",
                sender: "Example Sender",
                messages: text.split("\n").map((line) => ({
                    date: new Date(),
                    message: line,
                })),
            },
        ];
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Demo de Gráficos</h1>
            {messages ? (
                <ChartsDashboard messages={messages} />
            ) : (
                <p>Cargando mensajes...</p>
            )}
        </div>
    );
}
