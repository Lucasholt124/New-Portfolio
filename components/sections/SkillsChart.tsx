"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface Skill {
  name: string | null;
  category: string | null;
  proficiency: string | null;
  percentage: number | null;
  yearsOfExperience: number | null;
  color: string | null;
}

interface SkillsChartProps {
  skills: Skill[];
}

// Category icons/emojis for visual flair
const categoryEmojis: Record<string, string> = {
  frontend: "🎨",
  backend: "⚙️",
  database: "🗄️",
  devops: "🚀",
  mobile: "📱",
  design: "✨",
  tools: "🛠️",
  languages: "💻",
  frameworks: "📦",
  cloud: "☁️",
  testing: "🧪",
  other: "📌",
};

export function SkillsChart({ skills }: SkillsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!skills || skills.length === 0) {
    return null;
  }

  // Group skills by category dynamically
  const groupedSkills = new Map<string, Skill[]>();

  for (const skill of skills) {
    const category = skill.category || "other";
    const existing = groupedSkills.get(category) || [];
    groupedSkills.set(category, [...existing, skill]);
  }

  // Sort each category's skills by percentage (highest first)
  for (const [category, categorySkills] of groupedSkills) {
    groupedSkills.set(
      category,
      categorySkills.sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    );
  }

  // Loading skeleton
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card overflow-hidden animate-pulse"
          >
            <div className="border-b bg-muted/50 px-4 py-3">
              <div className="h-6 w-32 bg-muted rounded" />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-5 flex-1 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from(groupedSkills.entries()).map(([category, categorySkills]) => {
        if (!categorySkills || categorySkills.length === 0) return null;

        // Format category for display
        const displayLabel = category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const emoji = categoryEmojis[category.toLowerCase()] || "📌";

        // Calculate average proficiency for the category
        const avgProficiency = Math.round(
          categorySkills.reduce((sum, s) => sum + (s.percentage || 0), 0) /
            categorySkills.length
        );

        // Prepare chart data and config
        const chartData = categorySkills.map((skill) => ({
          name: skill.name || "Unknown",
          proficiency: skill.percentage || 0,
          fill: skill.color || "var(--color-proficiency)",
        }));

        const chartConfig = {
          proficiency: {
            label: "Proficiency",
            color: "hsl(var(--primary))",
          },
          default: {
            color: "hsl(var(--primary))",
          },
        } satisfies ChartConfig;

        // Calculate dynamic height based on number of skills (min 140px, 36px per skill)
        const chartHeight = Math.max(140, categorySkills.length * 36 + 10);

        return (
          <div
            key={category}
            className="group rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/40"
          >
            {/* Category Header */}
            <div className="border-b bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg" role="img" aria-label={displayLabel}>
                    {emoji}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {displayLabel}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    Média: {avgProficiency}%
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold tabular-nums">
                    {categorySkills.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-3 sm:p-4">
              <div style={{ width: "100%", minHeight: `${chartHeight}px` }}>
                <ChartContainer
                  id={`skills-chart-${category}`}
                  config={chartConfig}
                  className="w-full"
                  style={{ height: `${chartHeight}px`, minHeight: `${chartHeight}px` }}
                >
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                      right: 32,
                      top: 5,
                      bottom: 5,
                    }}
                  >
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={8}
                      axisLine={false}
                      width={80}
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                        fontWeight: 500,
                      }}
                    />
                    <ChartTooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          nameKey="proficiency"
                          labelFormatter={(value) => value}
                        />
                      }
                    />
                    <Bar
                      dataKey="proficiency"
                      radius={[0, 6, 6, 0]}
                      barSize={20}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      <LabelList
                        dataKey="proficiency"
                        position="right"
                        offset={6}
                        className="fill-foreground text-[11px] font-semibold"
                        formatter={(value: React.ReactNode) => {
                          if (typeof value === "number") {
                            return `${value}%`;
                          }
                          return "";
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}