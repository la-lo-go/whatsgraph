"use client";

import * as React from "react";
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	Legend,
	ResponsiveContainer,
} from "recharts";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";

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

import { CreateChartConfig } from "@/utils/ChartConfig";

interface YearlyActivityData {
	month: string;
	[sender: string]: number | string;
}

export default function YearlyActivity({
	messages,
}: {
	messages: WhatsAppMessages[];
	selectedSender: string | null;
	onSenderChange: (sender: string | null) => void;
}) {
	const chartConfig = React.useMemo(
		() => CreateChartConfig(messages),
		[messages],
	) as ChartConfig;

	const processData = React.useCallback(() => {
		const yearlyData: { [key: number]: YearlyActivityData[] } = {};

		for (const sender of messages) {
			for (const message of sender.messages) {
				const date = new Date(message.date);
				const year = date.getFullYear();
				const month = date.toLocaleString("default", { month: "short" });

				if (!yearlyData[year]) {
					yearlyData[year] = Array(12)
						.fill(0)
						.map((_, index) => ({
							month: new Date(2000, index, 1).toLocaleString("default", {
								month: "short",
							}),
						}));
				}

				const monthIndex = yearlyData[year].findIndex(
					(item) => item.month === month,
				);
				if (monthIndex !== -1) {
					yearlyData[year][monthIndex][sender.sender_slug] =
						((yearlyData[year][monthIndex][sender.sender_slug] as number) ||
							0) + 1;
				}
			}
		}

		for (const year of Object.keys(yearlyData)) {
			const senderSlugs = messages.map((m) => m.sender_slug);
			yearlyData[Number(year)] = Array(12)
				.fill(0)
				.map((_, index) => {
					const existingData = yearlyData[Number(year)][index] || {};
					return {
						month: new Date(2000, index, 1).toLocaleString("default", {
							month: "short",
						}),
						...Object.fromEntries(
							senderSlugs.map((slug) => [slug, existingData[slug] || 0]),
						),
					};
				});
		}

		return yearlyData;
	}, [messages]);

	const chartData = React.useMemo(() => processData(), [processData]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Yearly Activity</CardTitle>
				<CardDescription>
					Message distribution by month for each sender, per year
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap justify-center gap-4">
					{Object.entries(chartData).map(([year, data]) => (
						<div key={year} className="max-md:w-full">
							<h3 className="text-lg font-semibold mb-2 text-center">{year}</h3>
							<ChartContainer config={chartConfig} className="h-[300px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<RadarChart data={data}>
										<PolarGrid />
										<PolarAngleAxis dataKey="month" />
										<PolarRadiusAxis angle={30} domain={[0, "auto"]} />
										{Object.entries(chartConfig).map(
											([sender_slug, config]) => (
												<Radar
													key={sender_slug}
													name={String(config.label)}
													dataKey={sender_slug}
													stroke={config.color}
													fill={config.color}
													fillOpacity={0.1}
												/>
											),
										)}
										<ChartTooltip content={<ChartTooltipContent />} />
									</RadarChart>
								</ResponsiveContainer>
							</ChartContainer>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
