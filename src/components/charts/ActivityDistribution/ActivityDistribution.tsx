"use client";

import * as React from "react";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import HourlyActivity from "@/components/charts/ActivityDistribution/HourlyActivity";
import MonthlyActivity from "@/components/charts/ActivityDistribution/MonthlyActivity";
import WeeklyActivity from "@/components/charts/ActivityDistribution/WeeklyActivity";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function ActivityDistribution({
	messages,
}: {
	messages: WhatsAppMessages[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Activity Distribution</CardTitle>
				<CardDescription>
					Message distribution by month, day of week, and hour
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap justify-center gap-4">
					<MonthlyActivity messages={messages} />
					<WeeklyActivity messages={messages} />
					<HourlyActivity messages={messages} />
				</div>
			</CardContent>
		</Card>
	);
}
