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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface YearlyActivityData {
  month: string;
  [sender: string]: number | string;
}

export default function YearlyActivity({
  messages,
}: {
  messages: WhatsAppMessages[];
  selectedSender: string | null;
  onSenderChange: (sender: string | null) => void;
}) {
  const chartConfig = React.useMemo(() => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
    ];
    return Object.fromEntries(
      messages.map((m, index) => [
        m.sender_slug,
        {
          label: m.sender,
          color: colors[index % colors.length],
        },
      ])
    );
  }, [messages]) as ChartConfig;

  const processData = React.useCallback(() => {
    const yearlyData: { [key: number]: YearlyActivityData[] } = {};

    messages.forEach((sender) => {
      sender.messages.forEach((message) => {
        const date = new Date(message.date);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });

        if (!yearlyData[year]) {
          yearlyData[year] = Array(12).fill(0).map((_, index) => ({
            month: new Date(2000, index, 1).toLocaleString('default', { month: 'short' }),
          }));
        }

        const monthIndex = yearlyData[year].findIndex(item => item.month === month);
        if (monthIndex !== -1) {
          yearlyData[year][monthIndex][sender.sender_slug] = ((yearlyData[year][monthIndex][sender.sender_slug] as number) || 0) + 1;
        }
      });
    });

    Object.keys(yearlyData).forEach((year) => {
      const senderSlugs = messages.map(m => m.sender_slug);
      yearlyData[Number(year)] = Array(12).fill(0).map((_, index) => {
        const existingData = yearlyData[Number(year)][index] || {};
        return {
          month: new Date(2000, index, 1).toLocaleString('default', { month: 'short' }),
          ...Object.fromEntries(senderSlugs.map(slug => [slug, existingData[slug] || 0]))
        };
      });
    });

    return yearlyData;
  }, [messages]);

  const chartData = React.useMemo(() => processData(), [processData]);

  const senders = Object.keys(chartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Activity</CardTitle>
        <CardDescription>Message distribution by month for each sender, per year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(chartData).map(([year, data]) => (
            <div key={year} className="mb-8">
              <h3 className="text-lg font-semibold mb-2">{year}</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="month" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
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
                    <Legend />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}