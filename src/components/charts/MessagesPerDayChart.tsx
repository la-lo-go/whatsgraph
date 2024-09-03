"use client";

import * as React from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
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

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreateChartConfig } from "@/utils/ChartConfig";

interface MessageCountData {
	date: string;
	[sender_slug: string]: number | string;
}

function formatDate(date: string, time: string): Date {
	const [day, month, year] = date.split("/");
	const yyyy = year.length === 2 ? `20${year}` : year;
	return new Date(
		`${yyyy}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}:00`,
	);
}

export default function MessagesPerDayChart({
	messages,
	selectedSender,
	onSenderChange,
}: {
	messages: WhatsAppMessages[];
	selectedSender: string | null;
	onSenderChange: (sender: string | null) => void;
}) {
	const [timeRange, setTimeRange] = React.useState("all");
	const [ignoreZeroDays, setIgnoreZeroDays] = React.useState(true);

	const chartConfig = React.useMemo(
		() => CreateChartConfig(messages),
		[messages],
	) as ChartConfig;

	const processData = (messages: WhatsAppMessages[]): MessageCountData[] => {
		const countByDate: { [key: string]: { [key: string]: number } } = {};
		const senderSlugs = new Set<string>();

		for (const { sender_slug, messages: senderMessages } of messages) {
			senderSlugs.add(sender_slug);
			for (const message of senderMessages) {
				const dateString = message.date.toISOString().split("T")[0];
				if (!countByDate[dateString]) {
					countByDate[dateString] = {};
				}
				countByDate[dateString][sender_slug] =
					(countByDate[dateString][sender_slug] || 0) + 1;
			}
		}

		let processedData = Object.entries(countByDate).map(
			([date, senderCounts]) => ({
				date,
				...Object.fromEntries(
					Array.from(senderSlugs).map((sender_slug) => [
						sender_slug,
						senderCounts[sender_slug] || 0,
					]),
				),
			}),
		);

		if (!ignoreZeroDays) {
			const allDates = getDatesInRange(processedData);
			processedData = allDates.map((date) => {
				return countByDate[date]
					? { date, ...countByDate[date] }
					: {
							date,
							...Object.fromEntries(
								Array.from(senderSlugs).map((slug) => [slug, 0]),
							),
						};
			});
		}

		return processedData;
	};

	const getDatesInRange = (data: MessageCountData[]): string[] => {
		const dates = data.map((item) => new Date(item.date));
		const minDate = new Date(Math.min(...dates.map((date) => date.getTime())));
		const maxDate = new Date(Math.max(...dates.map((date) => date.getTime())));
		const allDates: string[] = [];

		for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
			allDates.push(d.toISOString().split("T")[0]);
		}

		return allDates;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: idk
	const chartData = React.useMemo(
		() => processData(messages),
		[messages, ignoreZeroDays],
	);

	const senders = Object.keys(chartConfig);

	const filteredData = React.useMemo(() => {
		const now = new Date();
		let cutoffDate = new Date(0);

		if (timeRange === "1y") {
			cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
		} else if (timeRange === "6m") {
			cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
		} else if (timeRange === "1m") {
			cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
		} else if (timeRange === "1w") {
			cutoffDate = new Date(now.setDate(now.getDate() - 7));
		} else if (timeRange === "all") {
			cutoffDate = new Date(0);
		}

		return chartData
			.filter((item) => {
				const itemDate = new Date(item.date);
				return itemDate >= cutoffDate;
			})
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [chartData, timeRange]);

	return (
		<Card>
			<CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>Messages Per Day</CardTitle>
					<CardDescription>
						Showing total messages for each sender in the selected time range
					</CardDescription>
				</div>
				<div className="flex flex-col gap-2 sm:items-center">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="rounded-lg"
							aria-label="Select time range"
						>
							<SelectValue placeholder="All" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="all" className="rounded-lg">
								All
							</SelectItem>
							<SelectItem value="1y" className="rounded-lg">
								Last year
							</SelectItem>
							<SelectItem value="6m" className="rounded-lg">
								Last 6 months
							</SelectItem>
							<SelectItem value="1m" className="rounded-lg">
								Last month
							</SelectItem>
							<SelectItem value="1w" className="rounded-lg">
								Last week
							</SelectItem>
						</SelectContent>
					</Select>
					<div className="flex items-center space-x-2">
						<Switch
							id="ignore-zero-days"
							checked={ignoreZeroDays}
							onCheckedChange={setIgnoreZeroDays}
						/>
						<Label htmlFor="ignore-zero-days">Ignore 0 messages days</Label>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<Tabs
					value={selectedSender || "all"}
					onValueChange={(value) =>
						onSenderChange(value === "all" ? null : value)
					}
				>
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						{senders.map((sender_slug) => (
							<TabsTrigger key={sender_slug} value={sender_slug}>
								{chartConfig[sender_slug].label}
							</TabsTrigger>
						))}
					</TabsList>

					{/* Render a tab for all senders */}
					<TabsContent value="all">
						<ChartContainer
							config={chartConfig}
							className="aspect-auto h-[250px] w-full"
						>
							<ResponsiveContainer>
								<LineChart data={filteredData}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="date"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										minTickGap={32}
										tickFormatter={(value) => {
											const date = new Date(value);
											return date.toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											});
										}}
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value) => `${value}`}
									/>
									<ChartTooltip
										cursor={false}
										content={
											<ChartTooltipContent
												labelFormatter={(value) => {
													const date = new Date(value);
													return date.toLocaleDateString("en-GB", {
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
													});
												}}
												indicator="dot"
											/>
										}
									/>
									{senders.map((sender_slug) => (
										<Line
											key={sender_slug}
											dataKey={sender_slug}
											type="monotone"
											stroke={chartConfig[sender_slug].color}
											strokeWidth={1.5}
											dot={false}
										/>
									))}
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</TabsContent>

					{/* Render a tab for each sender */}
					{senders.map((sender_slug) => (
						<TabsContent key={sender_slug} value={sender_slug}>
							<ChartContainer
								config={{ [sender_slug]: chartConfig[sender_slug] }}
								className="aspect-auto h-[250px] w-full"
							>
								<ResponsiveContainer>
									<LineChart
										data={filteredData.map((item) => ({
											date: item.date,
											[sender_slug]: item[sender_slug],
										}))}
									>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="date"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											minTickGap={32}
											tickFormatter={(value) => {
												const date = new Date(value);
												return date.toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												});
											}}
										/>
										<YAxis
											tickLine={false}
											axisLine={false}
											tickMargin={8}
											tickFormatter={(value) => `${value}`}
										/>
										<ChartTooltip
											cursor={false}
											content={
												<ChartTooltipContent
													labelFormatter={(value) => {
														const date = new Date(value);
														return date.toLocaleDateString("en-GB", {
															day: "2-digit",
															month: "2-digit",
															year: "numeric",
														});
													}}
													indicator="dot"
												/>
											}
										/>
										<Line
											dataKey={sender_slug}
											type="monotone"
											stroke={chartConfig[sender_slug].color}
											strokeWidth={1.5}
											dot={false}
										/>
									</LineChart>
								</ResponsiveContainer>
							</ChartContainer>
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
		</Card>
	);
}
