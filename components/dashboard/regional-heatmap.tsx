"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import the chart component with SSR disabled
const BarChart3 = dynamic(
  () => import("@/components/ui/chart").then((mod) => mod.BarChart3),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md"></div>
    )
  }
)

const data = [
  {
    name: "Algiers (North)",
    disease: 45,
    drought: 30,
    pest: 15,
  },
  {
    name: "Oran (West)",
    disease: 25,
    drought: 50,
    pest: 10,
  },
  {
    name: "Bejaya (East)",
    disease: 35,
    drought: 20,
    pest: 25,
  },
  {
    name: "Ghardaia (South)",
    disease: 30,
    drought: 35,
    pest: 20,
  },
]

export function RegionalHeatmap() {
  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm card-hover dark:bg-secondary/10 dark:border-secondary/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-800">Regional Distribution</CardTitle>
        <CardDescription>Reports by region and condition type</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart3 
          data={data}
          series={[
            { dataKey: "disease", name: "Disease", color: "#10b981", stackId: "a" },
            { dataKey: "drought", name: "Drought", color: "#f59e0b", stackId: "a" },
            { dataKey: "pest", name: "Pest", color: "#6366f1", stackId: "a" },
          ]}
          index="name"
          height={300}
        />
      </CardContent>
    </Card>
  )
}

