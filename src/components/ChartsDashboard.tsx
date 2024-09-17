import React, { useState } from "react";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import MessagesPerDayChart from "@/components/charts/MessagesPerDayChart";
import MostUsedWords from "@/components/charts/MostUsedWords";
import YearlyActivity from "@/components/charts/YearlyActivity";
import ActivityDistribution from "@/components/charts/ActivityDistribution/ActivityDistribution";
import MostUsedEmojis from "@/components/charts/MostUsedEmojis";
import { MonthlyWordCount } from "@/components/charts/MonthlyWordCount";
import GeneralData from "./charts/GeneralData/GeneralData";
import { SkeletonCard } from "./SkeletonCard";

interface ChartsDashboardProps {
  messages: WhatsAppMessages[];
  isLoading: boolean;
}

export default function ChartsDashboard({ messages, isLoading }: ChartsDashboardProps) {
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

  const handleSenderChange = (sender: string | null) => {
    setSelectedSender(sender);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 w-full">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <GeneralData messages={messages} />
      <MessagesPerDayChart
        messages={messages}
        selectedSender={selectedSender}
        onSenderChange={handleSenderChange}
      />
      <ActivityDistribution messages={messages} />
      <MonthlyWordCount messages={messages} />
      <YearlyActivity
        messages={messages}
        selectedSender={selectedSender}
        onSenderChange={handleSenderChange}
      />
      <MostUsed
        messages={messages}
        selectedSender={selectedSender}
        onSenderChange={handleSenderChange}
      />
    </div>
  );
}

function MostUsed({
  messages,
  selectedSender,
  onSenderChange,
}: {
  messages: WhatsAppMessages[];
  selectedSender: string | null;
  onSenderChange: (sender: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 w-full">
      <div>
        <MostUsedWords
          messages={messages}
          selectedSender={selectedSender}
          onSenderChange={onSenderChange}
        />
      </div>
      <div>
        <MostUsedEmojis
          messages={messages}
          selectedSender={selectedSender}
          onSenderChange={onSenderChange}
        />
      </div>
    </div>
  );
}