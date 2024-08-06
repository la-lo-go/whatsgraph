"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  LabelList,
} from "recharts";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";

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
  ChartLegend,
  ChartLegendContent,
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

interface WordFrequency {
  word: string;
  frequency: number;
}

interface TopWordsBySender {
  [senderSlug: string]: WordFrequency[];
}

function getTopWordsBySender(data: WhatsAppMessages[]): TopWordsBySender {
  const results: TopWordsBySender = {};

  data.forEach((person) => {
    const wordCounts: Record<string, number> = {};

    person.messages.forEach((msg) => {
      const regex = /[<>]/;
      if (!regex.test(msg.message)) {
        const words = msg.message
          .replace(/[^a-zA-Z\s]/g, "")
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 4);

        words.forEach((word) => {
          if (word) {
            if (!wordCounts[word]) {
              wordCounts[word] = 0;
            }
            wordCounts[word]++;
          }
        });
      }
    });

    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => ({ word: entry[0], frequency: entry[1] }));

    results[person.sender_slug] = topWords;
  });

  return results;
}

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

  const wordFrequencies = getTopWordsBySender(messages);
  const [selectedSender] = React.useState(senders[0]);

  const chartData = React.useMemo(() => {
    return wordFrequencies[selectedSender].map((word) => ({
      word: word.word,
      frequency: word.frequency,
    }));
  }, [selectedSender, wordFrequencies]);

  console.log(chartData);

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
                        className="fill-[--color-label] capitalize"
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
