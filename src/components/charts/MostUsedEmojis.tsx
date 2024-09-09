import * as React from "react";
import {
	XAxis,
	YAxis,
	ResponsiveContainer,
	Bar,
	BarChart,
	LabelList,
} from "recharts";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { GetTopEmojisBySender } from "@/utils/TextParser";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateChartConfig } from "@/utils/ChartConfig";

export default function MostUsedEmojis({
	messages,
	selectedSender,
	onSenderChange,
}: {
	messages: WhatsAppMessages[];
	selectedSender: string | null;
	onSenderChange: (sender: string | null) => void;
}) {
	const chartConfig = React.useMemo(
		() => CreateChartConfig(messages),
		[messages],
	) as ChartConfig;

	const senders = Object.keys(chartConfig);

	const emojiFrequencies = GetTopEmojisBySender(messages);

	const chartData = React.useMemo(() => {
		return emojiFrequencies[selectedSender || senders[0]].map((emoji) => ({
			emoji: emoji.emoji,
			frequency: emoji.frequency,
		}));
	}, [selectedSender, emojiFrequencies, senders]);

	return (
		<Card>
			<CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>Most Used Emojis</CardTitle>
					<CardDescription>
						Select a sender to view their most used emojis
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<Tabs
					value={selectedSender || senders[0]}
					onValueChange={onSenderChange}
				>
					<TabsList className='flex items-center justify-start flex-wrap h-auto space-y-1 w-fit'> 

						{senders.map((sender_slug) => (
							<TabsTrigger key={sender_slug} value={sender_slug}>
								{chartConfig[sender_slug].label}
							</TabsTrigger>
						))}
					</TabsList>

					{senders.map((sender_slug) => (
						<TabsContent key={sender_slug} value={sender_slug}>
							<ChartContainer
								config={{ [sender_slug]: chartConfig[sender_slug] }}
								className="aspect-auto h-[250px] w-full"
							>
								<ResponsiveContainer>
									<BarChart
										accessibilityLayer
										data={emojiFrequencies[sender_slug]}
										layout="vertical"
										margin={{ left: 5, right: 30 }}
										barGap={10}
									>
										<XAxis type="number" dataKey="frequency" hide />
										<YAxis
											dataKey="emoji"
											type="category"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent indicator="line" />}
										/>
										<Bar
											dataKey="frequency"
											layout="vertical"
											fill={chartConfig[sender_slug].color}
											radius={4}
										>
											<LabelList
												dataKey="frequency"
												position="right"
												offset={8}
												className="fill-foreground"
												fontSize={12}
											/>
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</ChartContainer>
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
		</Card>
	);
}
