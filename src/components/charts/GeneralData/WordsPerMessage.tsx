"use client";

import React, { useMemo } from "react";
import { MessageSquare } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";

export default function WordsPerMessage({
	messages,
}: {
	messages: WhatsAppMessages[];
}) {
	const averageWordsPerMessage = useMemo(() => {
		let totalWords = 0;
		let totalMessages = 0;

		for (const sender of messages) {
			for (const msg of sender.messages) {
				totalWords += msg.message.split(/\s+/).length;
				totalMessages++;
			}
		}

		return (totalWords / totalMessages).toFixed(1);
	}, [messages]);

	return (
		<Card className="flex flex-col w-full sm:w-[calc(50%-0.5rem)]">
			<CardHeader className="items-center pb-2">
				<CardTitle>Words per Message</CardTitle>
				<CardDescription>Average word count</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 flex items-center justify-center">
				<div className="text-4xl font-bold">{averageWordsPerMessage}</div>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm pt-4">
				<div className="flex items-center gap-2 font-medium leading-none">
					<MessageSquare className="h-4 w-4" /> Words per message
				</div>
				<div className="leading-none text-muted-foreground">
					Average number of words in each message
				</div>
			</CardFooter>
		</Card>
	);
}
