import React, { useState } from "react";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import MessagesPerDayChart from "@/components/charts/MessagesPerDayChart"
import MostUsedWords from "@/components/charts/MostUsedWords"
import YearlyActivity from "@/components/charts/YearlyActivity"
import ActivityDistribution from "@/components/charts/ActivityDistribution/ActivityDistribution"

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
      <YearlyActivity messages={messages} selectedSender={selectedSender} onSenderChange={handleSenderChange} />
      <MostUsedWords messages={messages} selectedSender={selectedSender} onSenderChange={handleSenderChange} />
    </div>
  );
}