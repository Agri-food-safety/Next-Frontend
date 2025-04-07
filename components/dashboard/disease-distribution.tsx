"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import the chart components with SSR disabled
const ChartContainer = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartContainer), { ssr: false })
const ChartPie = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartPie), { ssr: false })
const ChartLegend = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartLegend), { ssr: false })

const data = [
  { name: "Leaf Blight", value: 35, fill: "#10b981" },
  { name: "Rust", value: 25, fill: "#f59e0b" },
  { name: "Powdery Mildew", value: 15, fill: "#6366f1" },
  { name: "Drought Stress", value: 20, fill: "#ef4444" },
  { name: "Pest Damage", value: 5, fill: "#8b5cf6" },
]

export function DiseaseDistribution() {
  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm card-hover dark:bg-secondary/10 dark:border-secondary/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-800">Disease Distribution</CardTitle>
        <CardDescription>Breakdown of detected conditions by type</CardDescription>
      </CardHeader>
      <CardContent>
        {typeof window !== "undefined" && (
          <ChartContainer height={300}>
            <ChartPie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={90} paddingAngle={2} />
            <ChartLegend
              payload={data.map((item) => ({
                value: item.name,
                color: item.fill,
                id: item.name,
              }))}
            />
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

