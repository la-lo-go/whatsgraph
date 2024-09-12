"use client";
import { useEffect, useState } from "react";
import MyDropzone from "@/components/Dropzone";
import ChartsDashboard from "@/components/ChartsDashboard";
import { WhatsAppMessages, ParseWhatsAppMessages } from "@/utils/WhatsAppMessage";
import { Shield } from "lucide-react";

export default function Home() {
    const [messages, setMessages] = useState<WhatsAppMessages[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [dropzoneKey, setDropzoneKey] = useState(0);

    const handleMessagesParsed = (parsedMessages: WhatsAppMessages[]) => {
        setMessages(parsedMessages);
        setDropzoneKey((prevKey) => prevKey + 1);
    };

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
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 w-full">
                    <p className="text-2xl font-bold pb-4">Loading demo... Please wait :D</p>
                    <div className="animate-spin rounded-full h-32 w-32 border-4 border-primary border-t-transparent"></div>
                </div>
            ) : messages ? (
                <div className="w-full">
                    <p className="mb-4 text-center">
                        {(() => {
                            const totalMensagens = messages.reduce(
                                (total, currentMessage) =>
                                    total + currentMessage.messages.length,
                                0
                            );
                            return `${totalMensagens.toLocaleString()} messages analysed  📊`;
                        })()}
                    </p>
                    <ChartsDashboard messages={messages} />
                    <div className=" text-2xl w-full max-w-md mx-auto mt-8">
                            <p className="mb-2 font-semibold text-center group-hover:text-primary">
                                Did you like it?&nbsp;
                            <a href="/" className="font-bold underline decoration-emerald-400 transition duration-300 ease-in-out hover:bg-gradient-to-tr hover:from-emerald-200 hover:to-emerald-400 hover:bg-clip-text hover:text-transparent">
                                Try it now!
                            </a>
                            </p>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p>No messages loaded. Please upload a file.</p>
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