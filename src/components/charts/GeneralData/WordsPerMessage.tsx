"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import type { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { CreateChartConfig } from "@/utils/ChartConfig";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
    <div className="flex-1 pt-4 flex flex-col items-center justify-between w-[calc(50%-0.5rem)] max-sm:w-full">
      <div className="sm:mb-4 text-center">
        <h3 className="place-center font-bold text-xl">Words per message</h3>
        <h4 className="text-sm text-muted-foreground pb-2">
          Average word count in messages
        </h4>
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
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
              formatter={(value: number) => `${value.toFixed(1)} words`}
            />
            <Bar dataKey="averageWords">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} radius={4} />
              ))}
              <LabelList
                dataKey="averageWords"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toFixed(1)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
