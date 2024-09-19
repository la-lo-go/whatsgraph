"use client";

import { useState } from "react";
import MyDropzone from "@/components/Dropzone";
import ChartsDashboard from "@/components/ChartsDashboard";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { Rocket, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [messages, setMessages] = useState<WhatsAppMessages[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dropzoneKey, setDropzoneKey] = useState(0);

  const handleMessagesParsed = (parsedMessages: WhatsAppMessages[]) => {
    setIsLoading(true);
    setMessages(parsedMessages);
    setIsLoading(false);
    setDropzoneKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {!messages && !isLoading ? (
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center text-pretty">
            Upload your WhatsApp chat history to visualize it!
          </h1>
          <MyDropzone
            key={dropzoneKey}
            onMessagesParsed={handleMessagesParsed}
          />
          <PrivacyNotice />
          <DemoAnnouncement />
        </div>
      ) : (
        <div className="w-full">
          {!isLoading && (
            <p className="mb-4 text-center">
              {(() => {
                const totalMensagens = messages?.reduce(
                  (total, currentMessage) =>
                    total + currentMessage.messages.length,
                  0
                );
                return `${totalMensagens?.toLocaleString()} messages analysed  📊`;
              })()}
            </p>
          )}
          <ChartsDashboard messages={messages || []} isLoading={isLoading} />
          <div className="w-full max-w-md mx-auto mt-8">
            <MyDropzone
              key={dropzoneKey}
              onMessagesParsed={handleMessagesParsed}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DemoAnnouncement() {
  return (
    <p className="text-lg font-medium mt-2 text-center underline decoration-emerald-400">
      <Link
        href="/demo"
        className="font-bold transition duration-300 ease-in-out hover:bg-gradient-to-tr hover:from-emerald-200 hover:to-emerald-400 hover:bg-clip-text group inline-flex items-center"
      >
        <span className="text-primary transition-colors duration-300 group-hover:text-transparent">Explore the Demo Now!</span>
        <Rocket className="ml-1 -mb-1 w-5 h-5 group-hover:text-emerald-400 transition-colors duration-300" />
      </Link>
    </p>
  );
}

function PrivacyNotice() {
  return (
    <div className="bg-secondary rounded-xl p-4 flex items-center">
      <Shield className="text-primary mr-2" size={40} />
      <p className="text-sm text-muted-foreground">
        Your privacy is important. All data processing occurs in your browser,
        and no information is sent to any server.
      </p>
    </div>
  );
}
