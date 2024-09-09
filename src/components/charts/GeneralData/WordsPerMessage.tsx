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
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { CreateChartConfig } from "@/utils/ChartConfig";
import { ChartContainer } from "@/components/ui/chart";

export default function WordsPerMessage({
    messages,
}: {
    messages: WhatsAppMessages[];
}) {
    const chartConfig = CreateChartConfig(messages);

    const data = useMemo(() => {
        const result: { sender: string; averageWords: number; color: string; sender_slug: string }[] = [];

        for (const sender of messages) {
            let totalWords = 0;
            const totalMessages = sender.messages.length;

            for (const msg of sender.messages) {
                totalWords += msg.message.split(/\s+/).length;
            }

            result.push({
                sender: sender.sender,
                averageWords: totalMessages > 0 ? (totalWords / totalMessages) : 0,
                color: chartConfig[sender.sender_slug]?.color || "#8884d8",
                sender_slug: sender.sender_slug
            });
        }

        console.log(result)

        return result;
    }, [messages, chartConfig]);

    return (
        <div className="flex-1 pb-0 pt-4 flex flex-col items-center justify-center sm:w-[calc(50%-0.5rem)]">
            <h3>Words per message</h3>

            <ChartContainer config={chartConfig} className="mx-auto h-[200px]">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="sender" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [value.toFixed(1), "Average Words"]} />
                        <Bar dataKey="averageWords">
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={chartConfig[entry.sender_slug].color}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
