"use client";

import React, { useMemo } from "react";
import {
	LabelList,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
} from "@/components/ui/chart";

import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { CreateChartConfig } from "@/utils/ChartConfig";
import { ExtractWords } from "@/utils/TextParser";

export default function ChatParticipation({
	messages,
}: {
	messages: WhatsAppMessages[];
}) {
	const chartConfig = useMemo(
		() => CreateChartConfig(messages),
		[messages],
	) as ChartConfig;

	const chartData = useMemo(() => {
		const totalWords = messages.reduce(
			(sum, sender) =>
				sum +
				sender.messages.reduce(
					(senderSum, msg) => senderSum + ExtractWords(msg.message).length,
					0,
				),
			0,
		);

		return messages.map((sender) => {
			const senderWords = sender.messages.reduce(
				(sum, msg) => sum + ExtractWords(msg.message).length,
				0,
			);
			const percentage = (senderWords / totalWords) * 100;

			return {
				name: chartConfig[sender.sender_slug].label,
				sender: sender.sender_slug,
				words: senderWords,
				percentage: Number.parseFloat(percentage.toFixed(2)),
				fill: chartConfig[sender.sender_slug].color,
			};
		});
	}, [messages, chartConfig]);

	return (
		<div className="flex-1 pt-4 flex flex-col items-center justify-between w-full h-full">
			<div className="justify-start mb-4 text-center">
				<h3 className="font-bold text-xl">Chat Participation</h3>
				<h4 className="text-sm text-muted-foreground">
					Percentage of total words
				</h4>
			</div>

			<ChartContainer
				config={chartConfig}
				className="mx-auto w-full max-w-[300px] aspect-square"
			>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={chartData}
							dataKey="percentage"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius="85%"
							className="justify-center "
						>
							<LabelList
								dataKey="percentage"
								className="fill-foreground"
								stroke="none"
								fontSize={10}
								formatter={(value: string) => `${value}%`}
							/>
						</Pie>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</ChartContainer>
		</div>
	);
}
