"use client";

import { useState } from "react";
import MyDropzone from "@/components/Dropzone";
import ChartsDashboard from "@/components/ChartsDashboard";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { Shield } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8">
      {!messages && !isLoading ? (
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Upload your WhatsApp chat history to visualize it!
          </h1>
          <MyDropzone
            key={dropzoneKey}
            onMessagesParsed={handleMessagesParsed}
          />
          <PrivacyNotice />
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

function PrivacyNotice() {
	return (
		<div className="bg-secondary rounded-xl p-4 mt-4 flex items-center">
			<Shield className="text-primary mr-2" size={40} />
			<p className="text-sm text-muted-foreground">
				Your privacy is important. All data processing occurs in your browser,
				and no information is sent to any server.
			</p>
		</div>
	);
}
