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
import { CreateChartConfig } from "@/utils/ChartConfig";

export default function MostUsedWords({
  messages,
  selectedSender,
  onSenderChange,
}: {
  messages: WhatsAppMessages[];
  selectedSender: string | null;
  onSenderChange: (sender: string | null) => void;
}) {
  const chartConfig = React.useMemo(() => CreateChartConfig(messages), [messages]) as ChartConfig;

  const senders = Object.keys(chartConfig);

  const wordFrequencies = GetTopWordsBySender(messages);

  const chartData = React.useMemo(() => {
    return wordFrequencies[selectedSender || senders[0]].map((word) => ({
      word: word.word,
      frequency: word.frequency,
    }));
  }, [selectedSender, wordFrequencies, senders]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Most Used Words</CardTitle>
          <CardDescription>
            Select a sender to view their most used words
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Tabs value={selectedSender || senders[0]} onValueChange={onSenderChange}>
          <TabsList>
            {senders.map((sender_slug) => (
              <TabsTrigger key={sender_slug} value={sender_slug}>
                {chartConfig[sender_slug].label}
              </TabsTrigger>
            ))}
          </TabsList>

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
                    margin={{ left: 5, right: 30 }}
                  >
                    <XAxis type="number" dataKey="frequency" hide />
                    <YAxis
                      dataKey="word"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      fontWeight={"bold"}
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
                        dataKey="frequency"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                        fontWeight={"semibold"}
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