import React, { useState } from "react";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import MessagesPerDayChart from "@/components/charts/MessagesPerDayChart"
import MostUsedWords from "@/components/charts/MostUsedWords"
import YearlyActivity from "@/components/charts/YearlyActivity"
import ActivityDistribution from "@/components/charts/ActivityDistribution/ActivityDistribution"
import MostUsedEmojis from "@/components/charts/MostUsedEmojis"
import { MonthlyWordCount } from "@/components/charts/MonthlyWordCount";

interface ChartsDashboardProps {
  messages: WhatsAppMessages[];
}

export default function ChartsDashboard({ messages }: ChartsDashboardProps) {
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

  const handleSenderChange = (sender: string | null) => {
    setSelectedSender(sender);
  };

  return (
    <div className="flex flex-col gap-4">
      <MessagesPerDayChart messages={messages} selectedSender={selectedSender} onSenderChange={handleSenderChange} />
      <ActivityDistribution messages={messages} selectedSender={selectedSender} onSenderChange={handleSenderChange} />
      <MonthlyWordCount messages={messages} />
      <YearlyActivity messages={messages} selectedSender={selectedSender} onSenderChange={handleSenderChange} />
      <MostUsed messages={messages} selectedSender={selectedSender} onSenderChange={handleSenderChange} />
    </div>
  );
}

function MostUsed({ messages, selectedSender, onSenderChange }: { messages: WhatsAppMessages[]; selectedSender: string | null; onSenderChange: (sender: string | null) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 w-full">
      <div>
        <MostUsedWords messages={messages} selectedSender={selectedSender} onSenderChange={onSenderChange} />
      </div>
      <div>
        <MostUsedEmojis messages={messages} selectedSender={selectedSender} onSenderChange={onSenderChange} />
      </div>
    </div>
  );
}

