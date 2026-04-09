"use client";

import { PieChart, Pie, Cell } from "recharts";
import { CategoryStats } from "@/types/category";
import styles from "./TransactionsChart.module.css";

const GREEN_SHADES = [
  "#0EF387",
  "#0DDB7A",
  "#0CC36D",
  "#0BAB61",
  "#099354",
  "#087B47",
  "#06633A",
  "#054B2D",
  "#033320",
  "#021B13",
];

function assignColors(sortedByValue: { totalAmount: number }[]): string[] {
  const n = sortedByValue.length;
  if (n === 0) return [];

  if (n === 1) return [GREEN_SHADES[0]];

  const lastIndex = GREEN_SHADES.length - 1;
  return sortedByValue.map((_, i) => {
    const paletteIndex = Math.round((i * lastIndex) / (n - 1));
    return GREEN_SHADES[paletteIndex];
  });
}

interface TransactionsChartProps {
  rawStats: CategoryStats[];
  isLoading: boolean;
}

export default function TransactionsChart({
  rawStats,
  isLoading,
}: TransactionsChartProps) {
  const hasData = !isLoading && rawStats.length > 0;

  const total = hasData
    ? rawStats.reduce((sum, item) => sum + item.totalAmount, 0)
    : 0;
  const sorted = hasData
    ? [...rawStats].sort((a, b) => b.totalAmount - a.totalAmount)
    : [];
  const colors = hasData ? assignColors(sorted) : [];

  const chartData = sorted.map((item, index) => ({
    name: item.category,
    value: item.totalAmount,
    percentage: total > 0 ? Math.round((item.totalAmount / total) * 100) : 0,
    color: colors[index],
  }));

  const CX = 150;
  const CY = 150;
  const INNER = 105;
  const OUTER = 150;
  const CAP_RADIUS = 10;

  const layers: { endAngle: number; color: string }[] = [];
  if (hasData) {
    let cumSum = 0;
    const cumulative = chartData.map((item) => {
      cumSum += item.value;
      return cumSum;
    });

    for (let i = chartData.length - 1; i >= 0; i--) {
      const cumPercent = cumulative[i] / total;
      layers.push({
        endAngle: 180 - cumPercent * 180,
        color: chartData[i].color,
      });
    }
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Expenses categories</h3>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <PieChart width={310} height={180}>
            <Pie
              data={[{ value: 1 }]}
              cx={CX}
              cy={CY}
              startAngle={180}
              endAngle={0}
              innerRadius={INNER}
              outerRadius={OUTER}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
              cornerRadius={CAP_RADIUS}
              className={isLoading ? styles.skeleton : undefined}
            >
              <Cell fill="#2a2a2a" />
            </Pie>

            {layers.map((layer, i) => (
              <Pie
                key={`layer-${i}`}
                data={[{ value: 1 }]}
                cx={CX}
                cy={CY}
                startAngle={180}
                endAngle={layer.endAngle}
                innerRadius={INNER}
                outerRadius={OUTER}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
                cornerRadius={CAP_RADIUS}
              >
                <Cell fill={layer.color} />
              </Pie>
            ))}
          </PieChart>

          {!isLoading && (
            <p
              className={`${styles.totalLabel} ${
                !hasData ? styles.totalLabelEmpty : ""
              }`}
            >
              {hasData ? "100%" : "No categories"}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className={styles.skeletonLegend}>
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLine} />
          </div>
        ) : hasData ? (
          <ul className={styles.legend}>
            {chartData.slice(0, 4).map((item, index) => (
              <li key={index} className={styles.legendItem}>
                <span
                  className={styles.marker}
                  style={{ backgroundColor: item.color }}
                />
                <span className={styles.categoryName}>{item.name}</span>
                <span className={styles.percentage}>{item.percentage}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No categories added yet</p>
            <p className={styles.emptyHint}>
              Add categories to start tracking your expenses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
