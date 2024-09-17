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
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { CreateChartConfig } from "@/utils/ChartConfig";

interface ActivityData {
	key: string;
	[sender: string]: number | string;
}

type TimeUnit = "monthly" | "weekly" | "hourly";

interface ActivityDistributionChartProps {
	messages: WhatsAppMessages[];
	timeUnit: TimeUnit;
	title: string;
}

export default function ActivityDistributionChart({
	messages,
	timeUnit,
	title,
}: ActivityDistributionChartProps) {
	const chartConfig = React.useMemo(
		() => CreateChartConfig(messages),
		[messages],
	) as ChartConfig;

	const processData = React.useCallback(() => {
		let keys: string[];
		let getKey: (date: Date) => string;

		switch (timeUnit) {
			case "monthly":
				keys = Array(12)
					.fill(0)
					.map((_, index) =>
						new Date(2000, index, 1).toLocaleString("en-US", {
							month: "short",
						}),
					);
				getKey = (date) =>
					new Date(date).toLocaleString("en-US", { month: "short" });
				break;
			case "weekly":
				keys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				getKey = (date) => keys[new Date(date).getDay()];
				break;
			case "hourly":
				keys = Array(24)
					.fill(0)
					.map((_, index) => index.toString().padStart(2, "0"));
				getKey = (date) =>
					new Date(date).getHours().toString().padStart(2, "0");
				break;
		}

		const activityData: ActivityData[] = keys.map((key) => ({ key }));

		for (const sender of messages) {
			for (const message of sender.messages) {
				const key = getKey(new Date(message.date));
				const dataIndex = activityData.findIndex((data) => data.key === key);
				activityData[dataIndex][sender.sender_slug] =
					((activityData[dataIndex][sender.sender_slug] as number) || 0) + 1;
			}
		}

		const senderSlugs = messages.map((m) => m.sender_slug);
		for (const data of activityData) {
			for (const slug of senderSlugs) {
				if (!(slug in data)) {
					data[slug] = 0;
				}
			}
		}

		return activityData;
	}, [messages, timeUnit]);

	const chartData = React.useMemo(() => processData(), [processData]);

	const getRadiusAxisAngle = () => {
		switch (timeUnit) {
			case "weekly":
				return 39;
			default:
				return 30;
		}
	};

	return (
		<div className="mb-8">
			<h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>

			<ChartContainer config={chartConfig} className="h-[300px]">
				<ResponsiveContainer width="100%" height="100%">
					<RadarChart data={chartData}>
						<PolarGrid />
						<PolarAngleAxis dataKey="key" />
						<PolarRadiusAxis
							angle={getRadiusAxisAngle()}
							domain={[0, "auto"]}
						/>
						{Object.entries(chartConfig).map(([sender_slug, config]) => (
							<Radar
								key={sender_slug}
								name={String(config.label)}
								dataKey={sender_slug}
								stroke={config.color}
								fill={config.color}
								fillOpacity={0.1}
							/>
						))}
						<ChartTooltip content={<ChartTooltipContent />} />
					</RadarChart>
				</ResponsiveContainer>
			</ChartContainer>
		</div>
	);
}
