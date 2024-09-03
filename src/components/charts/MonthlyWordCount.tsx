"use client"

import React, { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { WhatsAppMessages } from "@/utils/WhatsAppMessage"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CreateChartConfig } from "@/utils/ChartConfig"

interface MonthlyWordCountProps {
  messages: WhatsAppMessages[]
}

export function MonthlyWordCount({ messages }: MonthlyWordCountProps) {
  const chartConfig = React.useMemo(() => CreateChartConfig(messages), [messages]) as ChartConfig;

  const [showAllMonths, setShowAllMonths] = React.useState(false);

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { [sender: string]: number } } = {}

    let earliestDate = new Date();
    let latestDate = new Date(0);

    messages.forEach((senderMessages) => {
      senderMessages.messages.forEach((message) => {
        const date = new Date(message.date)
        earliestDate = date < earliestDate ? date : earliestDate;
        latestDate = date > latestDate ? date : latestDate;

        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {}
        }

        if (!monthlyData[monthYear][senderMessages.sender_slug]) {
          monthlyData[monthYear][senderMessages.sender_slug] = 0
        }

        const wordCount = message.message.split(/\s+/).length
        monthlyData[monthYear][senderMessages.sender_slug] += wordCount
      })
    })

    let processedData = Object.entries(monthlyData)
      .map(([monthYear, senderCounts]) => ({
        monthYear,
        ...senderCounts,
      }))

    if (showAllMonths) {
      const allMonths: string[] = [];
      const startDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
      const endDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);

      for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
        allMonths.push(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`);
      }

      processedData = allMonths.map(monthYear => {
        return monthlyData[monthYear]
          ? { monthYear, ...monthlyData[monthYear] }
          : { monthYear, ...Object.fromEntries(messages.map(m => [m.sender_slug, 0])) };
      });
    }

    return processedData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  }, [messages, showAllMonths])

  const senders = Object.keys(chartConfig)

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Monthly Word Count</CardTitle>
          <CardDescription>Total words written by each sender per month</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-all-months"
            checked={showAllMonths}
            onCheckedChange={setShowAllMonths}
          />
          <Label htmlFor="show-all-months">Show all months</Label>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="monthYear"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-')
                  return `${month}/${year.slice(2)}`
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => {
                      const [year, month] = label.split('-')
                      return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {senders.map((sender, index) => (
                <Bar
                  key={sender}
                  dataKey={sender}
                  stackId="a"
                  fill={chartConfig[sender].color}
                  radius={index === senders.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}