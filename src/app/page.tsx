"use client";

import { useState } from "react";
import MyDropzone from "@/components/Dropzone";
import ChartsDashboard from "@/components/ChartsDashboard";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export default function Home() {
  const [messages, setMessages] = useState<WhatsAppMessages[] | null>(null);

  const handleMessagesParsed = (parsedMessages: WhatsAppMessages[]) => {
    setMessages(parsedMessages);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-20 p-8 max-lg:px-4">
      {!messages ? (
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Upload your WhatsApp chat history to visualize it!
          </h1>
          <div className="flex justify-center">
            <MyDropzone onMessagesParsed={handleMessagesParsed} />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <ChartsDashboard messages={messages} />
          <p className="mt-4 text-center">
            Total of messages analyzed: {messages.reduce((acc, curr) => acc + curr.messages.length, 0)}
          </p>
          <div className="w-full flex items-center justify-center">
            <div className="w-1/2 pt-4">
              <MyDropzone onMessagesParsed={handleMessagesParsed} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
