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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ActivityData {
  key: string;
  [sender: string]: number | string;
}

type TimeUnit = "monthly" | "weekly" | "hourly";

interface ActivityDistributionChartProps {
  messages: WhatsAppMessages[];
  timeUnit: TimeUnit;
  title: string;
}

export default function ActivityDistributionChart({
  messages,
  timeUnit,
  title,
}: ActivityDistributionChartProps) {
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
    let keys: string[];
    let getKey: (date: Date) => string;

    switch (timeUnit) {
      case "monthly":
        keys = Array(12).fill(0).map((_, index) => 
          new Date(2000, index, 1).toLocaleString('default', { month: 'short' })
        );
        getKey = (date) => new Date(date).toLocaleString('default', { month: 'short' });
        break;
      case "weekly":
        keys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        getKey = (date) => keys[new Date(date).getDay()];
        break;
      case "hourly":
        keys = Array(24).fill(0).map((_, index) => index.toString().padStart(2, '0'));
        getKey = (date) => new Date(date).getHours().toString().padStart(2, '0');
        break;
    }

    const activityData: ActivityData[] = keys.map(key => ({ key }));

    messages.forEach((sender) => {
      sender.messages.forEach((message) => {
        const key = getKey(new Date(message.date));
        const dataIndex = activityData.findIndex(data => data.key === key);
        activityData[dataIndex][sender.sender_slug] = ((activityData[dataIndex][sender.sender_slug] as number) || 0) + 1;
      });
    });

    const senderSlugs = messages.map(m => m.sender_slug);
    activityData.forEach(data => {
      senderSlugs.forEach(slug => {
        if (!(slug in data)) {
          data[slug] = 0;
        }
      });
    });

    return activityData;
  }, [messages, timeUnit]);

  const chartData = React.useMemo(() => processData(), [processData]);

  const getRadiusAxisAngle = () => {
    switch (timeUnit) {
      case "weekly":
        return 39;
      case "hourly":
      case "monthly":
      default:
        return 30;
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="key" />
            <PolarRadiusAxis angle={getRadiusAxisAngle()} domain={[0, 'auto']} />
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
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}