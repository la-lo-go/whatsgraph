"use client";

import * as React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { WhatsAppMessages } from "@/utils/WhatsAppMessage";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface HourlyActivityData {
  hour: string;
  [sender: string]: number | string;
}

export default function HourlyActivityRadarChart({
  messages,
  selectedSender,
  onSenderChange,
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
    const hourlyData: HourlyActivityData[] = Array(24).fill(0).map((_, index) => ({
      hour: index.toString().padStart(2, '0'),
    }));

    messages.forEach((sender) => {
      sender.messages.forEach((message) => {
        const date = new Date(message.date);
        const hour = date.getHours();
        hourlyData[hour][sender.sender_slug] = ((hourlyData[hour][sender.sender_slug] as number) || 0) + 1;
      });
    });

    const senderSlugs = messages.map(m => m.sender_slug);
    hourlyData.forEach(hourData => {
      senderSlugs.forEach(slug => {
        if (!(slug in hourData)) {
          hourData[slug] = 0;
        }
      });
    });

    return hourlyData;
  }, [messages]);

  const chartData = React.useMemo(() => processData(), [processData]);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="hour" />
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
          <ChartTooltip content={<ChartTooltipContent />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}