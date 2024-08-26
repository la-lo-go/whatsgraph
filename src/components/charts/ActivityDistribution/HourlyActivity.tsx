import ActivityDistributionChart from './ActivityDistributionChart';
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export default function HourlyActivity({
  messages,
}: {
  messages: WhatsAppMessages[];
}) {
  return (
    <ActivityDistributionChart
      messages={messages}
      timeUnit="hourly"
      title="Hourly"
    />
  );
}