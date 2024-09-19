"use client";

import React, { useMemo, useState } from "react";
import {
	CardContent,
} from "@/components/ui/card";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import {
	BarChart,
	Bar,
	XAxis,
	ResponsiveContainer,
	Cell,
	CartesianGrid,
	LabelList,
} from "recharts";
import { CreateChartConfig } from "@/utils/ChartConfig";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number) => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}h ${minutes}min`;
};

export default function AverageResponseTime({
	messages,
}: {
	messages: WhatsAppMessages[];
}) {
	const [maxDays, setMaxDays] = useState(1);
	const chartConfig = useMemo(() => CreateChartConfig(messages), [messages]);

	const averageResponseTimes = useMemo(() => {
		const responseTimes: {
			[key: string]: { total: number; count: number; name: string };
		} = {};
		let lastSender: string | null = null;
		let lastMessageTime: number | null = null;

		const senderNameMap = Object.fromEntries(
			messages.map((m) => [m.sender_slug, m.sender]),
		);

		for (const message of messages
			.flatMap((sender) =>
				sender.messages.map((msg) => ({ ...msg, sender: sender.sender_slug })),
			)
			.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			)) {
			const currentTime = new Date(message.date).getTime();

			if (
				lastSender &&
				lastSender !== message.sender &&
				lastMessageTime !== null
			) {
				const timeDiff = currentTime - lastMessageTime;
				if (timeDiff < maxDays * 86400000) {
					if (!responseTimes[message.sender]) {
						responseTimes[message.sender] = {
							total: 0,
							count: 0,
							name: senderNameMap[message.sender],
						};
					}
					responseTimes[message.sender].total += timeDiff;
					responseTimes[message.sender].count++;
				}
			}

			lastSender = message.sender;
			lastMessageTime = currentTime;
		}

		return Object.entries(responseTimes).map(([sender, data]) => ({
			sender: data.name,
			averageTime: data.count > 0 ? data.total / data.count / 1000 : 0,
			sender_slug: sender,
		}));
	}, [messages, maxDays]);

	const maxResponseTime = useMemo(() => {
		return Math.max(...averageResponseTimes.map((item) => item.averageTime));
	}, [averageResponseTimes]);

	return (
		<div className="flex-1 pb-0 pt-4 flex flex-col items-center justify-between w-full lg:pr-4">
			<div className="justify-start mb-2 text-center">
				<h3 className="font-bold text-xl">Average Response Time</h3>
				<h4 className="text-sm text-muted-foreground pb-2">
					Time between messages for each sender
				</h4>
			</div>

			<div className="w-full max-w-xs mb-4">
				<label
					htmlFor="days-slider"
					className="block text-sm font-medium text-gray-700 mb-1 text-center"
				>
					Maximum days for valid response: {maxDays} day
					{maxDays !== 1 ? "s" : ""}
				</label>
				<Slider
					id="days-slider"
					min={1}
					max={10}
					step={1}
					value={[maxDays]}
					onValueChange={(value) => setMaxDays(value[0])}
				/>
			</div>
			<ChartContainer config={chartConfig} className="w-full">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={averageResponseTimes}
						margin={{
							top: 20,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="sender"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 7)}...` : value}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
							formatter={(value: number) => formatTime(value)}
						/>
						<Bar dataKey="averageTime">
							{averageResponseTimes.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={chartConfig[entry.sender_slug].color}
									radius={4}
								/>
							))}
							<LabelList
								dataKey="averageTime"
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
								formatter={formatTime}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</ChartContainer>
		</div>
	);
}
