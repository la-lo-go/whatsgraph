"use client";

import * as React from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  LabelList,
} from "recharts";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";
import { GetTopWordsBySender } from "@/utils/TextParser";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MostUsedWords({
  messages,
}: {
  messages: WhatsAppMessages[];
}) {
  const chartConfig = React.useMemo(() => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
    ];
    const config = Object.fromEntries(
      messages
        .map((m) => m.sender_slug)
        .map((sender_slug, index) => [
          sender_slug,
          {
            label:
              messages.find((m) => m.sender_slug === sender_slug)?.sender ||
              sender_slug,
            color: colors[index % colors.length],
          },
        ])
    );

    return config;
  }, [messages]) as ChartConfig;

  const senders = Object.keys(chartConfig);

  const wordFrequencies = GetTopWordsBySender(messages);
  const [selectedSender] = React.useState(senders[0]);

  const chartData = React.useMemo(() => {
    return wordFrequencies[selectedSender].map((word) => ({
      word: word.word,
      frequency: word.frequency,
    }));
  }, [selectedSender, wordFrequencies]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Most Used Words by Sender</CardTitle>
          <CardDescription>
            Select a sender to view their most used words
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Tabs defaultValue={senders[0]}>
          <TabsList>
            {senders.map((sender_slug) => (
              <TabsTrigger key={sender_slug} value={sender_slug}>
                {chartConfig[sender_slug].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Render all the tabs content */}
          {senders.map((sender_slug) => (
            <TabsContent key={sender_slug} value={sender_slug}>
              <ChartContainer
                config={{ [sender_slug]: chartConfig[sender_slug] }}
                className="aspect-auto h-[250px] w-full"
              >
                <ResponsiveContainer>
                  <BarChart
                    accessibilityLayer
                    data={wordFrequencies[sender_slug]}
                    layout="vertical"
                  >
                    <XAxis type="number" dataKey="frequency" hide />
                    <YAxis
                      dataKey="word"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      hide
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                      dataKey="frequency"
                      layout="vertical"
                      fill={chartConfig[sender_slug].color}
                      radius={4}
                    >
                      <LabelList
                        dataKey="word"
                        position="insideLeft"
                        offset={8}
                        className={`fill-[${chartConfig[sender_slug].color}] mix-blend-color-dodge`}
                        fontSize={12}
                      />
                      <LabelList
                        dataKey="frequency"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
