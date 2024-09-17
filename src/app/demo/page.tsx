"use client"

import { useState, useEffect } from "react";
import ChartsDashboard from "@/components/ChartsDashboard";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { ParseWhatsAppMessages } from "@/utils/WhatsAppMessage";

export default function Home() {
  const [messages, setMessages] = useState<WhatsAppMessages[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/fake_chat.txt");
        const text = await response.text();
        const parsedMessages = ParseWhatsAppMessages(text);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading || !messages ? (
        <ChartsDashboard messages={[]} isLoading={true} />
      ) : (
        <div className="w-full">
          <ChartsDashboard messages={messages} isLoading={false} />
          <div className="text-2xl w-full max-w-md mx-auto mt-8">
            <p className="mb-2 font-semibold text-center group-hover:text-primary">
              Did you like it?&nbsp;
              <a href="/" className="font-bold underline decoration-emerald-400 transition duration-300 ease-in-out hover:bg-gradient-to-tr hover:from-emerald-200 hover:to-emerald-400 hover:bg-clip-text hover:text-transparent">
                Try it now!
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}