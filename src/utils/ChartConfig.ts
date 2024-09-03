import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export function CreateChartConfig(messages: WhatsAppMessages[]) {
	const colors = [
		"hsl(var(--chart-1))",
		"hsl(var(--chart-2))",
		"hsl(var(--chart-3))",
		"hsl(var(--chart-4))",
	];
	return Object.fromEntries(
		messages.map((m, index) => [
			m.sender_slug,
			{
				label: m.sender,
				color: colors[index % colors.length],
			},
		]),
	);
}
