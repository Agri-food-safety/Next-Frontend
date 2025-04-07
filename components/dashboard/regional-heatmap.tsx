"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import the chart components with SSR disabled
const ChartContainer = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartContainer), { ssr: false })
const ChartBar = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartBar), { ssr: false })
const ChartGrid = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartGrid), { ssr: false })
const ChartXAxis = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartXAxis), { ssr: false })
const ChartYAxis = dynamic(() => import("@/components/ui/chart").then((mod) => mod.ChartYAxis), { ssr: false })

const data = [
  {
    name: "Northern",
    disease: 45,
    drought: 30,
    pest: 15,
  },
  {
    name: "Eastern",
    disease: 25,
    drought: 50,
    pest: 10,
  },
  {
    name: "Western",
    disease: 35,
    drought: 20,
    pest: 25,
  },
  {
    name: "Southern",
    disease: 30,
    drought: 35,
    pest: 20,
  },
  {
    name: "Central",
    disease: 40,
    drought: 25,
    pest: 15,
  },
]

export function RegionalHeatmap() {
  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-800">Regional Distribution</CardTitle>
        <CardDescription>Reports by region and condition type</CardDescription>
      </CardHeader>
      <CardContent>
        {typeof window !== "undefined" && (
          <ChartContainer height={300}>
            <ChartGrid vertical={false} />
            <ChartBar dataKey="disease" fill="#10b981" radius={4} data={data} name="Disease" stackId="a" />
            <ChartBar dataKey="drought" fill="#f59e0b" radius={4} data={data} name="Drought" stackId="a" />
            <ChartBar dataKey="pest" fill="#6366f1" radius={4} data={data} name="Pest" stackId="a" />
            <ChartXAxis dataKey="name" />
            <ChartYAxis />
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

