"use client";

import * as React from "react";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";

import { Card, CardContent } from "@/components/ui/card";

import ChatParticipation from "@/components/charts/GeneralData/ChatParticipation";
import AverageResponseTime from "@/components/charts/GeneralData/AverageResponseTime";
import WordsPerMessage from "@/components/charts/GeneralData/WordsPerMessage";

export default function GeneralData({
	messages,
}: {
	messages: WhatsAppMessages[];
}) {
	return (
		<Card>
			<CardContent>
				<div className="flex flex-wrap justify-center gap-4">
					<ChatParticipation messages={messages} />
					<AverageResponseTime messages={messages} />
					<WordsPerMessage messages={messages} />
				</div>
			</CardContent>
		</Card>
	);
}
