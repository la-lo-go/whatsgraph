import React from "react";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import MessagesPerDayChart from "@/components/charts/MessagesPerDayChart"
import MostUsedWords from "@/components/charts/MostUsedWords"

interface ChartsDashboardProps {
  messages: WhatsAppMessages[];
}

export default function ChartsDashboard({ messages }: ChartsDashboardProps) {
  console.log(messages);
  return (
    <div className="flex flex-col gap-4">
      <MessagesPerDayChart messages={messages} />
      <MostUsedWords messages={messages} />
    </div>
  );
}

