import ActivityDistributionChart from "./ActivityDistributionChart";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export default function WeeklyActivity({
	messages,
}: {
	messages: WhatsAppMessages[];
}) {
	return (
		<ActivityDistributionChart
			messages={messages}
			timeUnit="monthly"
			title="Monthly"
		/>
	);
}
