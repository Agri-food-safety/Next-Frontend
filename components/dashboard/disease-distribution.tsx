"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import the chart component with SSR disabled
const PieChart3 = dynamic(
  () => import("@/components/ui/chart").then((mod) => mod.PieChart3),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-md"></div>
    )
  }
)

const data = [
  { name: "Early Blight", value: 35, color: "#ef4444" },
  { name: "Leaf Spot", value: 25, color: "#f59e0b" },
  { name: "Powdery Mildew", value: 20, color: "#10b981" },
  { name: "Root Rot", value: 15, color: "#6366f1" },
  { name: "Other", value: 5, color: "#8b5cf6" },
]

export function DiseaseDistribution() {
  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm card-hover dark:bg-secondary/10 dark:border-secondary/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-800">Disease Distribution</CardTitle>
        <CardDescription>Plant diseases by percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart3
          data={data}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </CardContent>
    </Card>
  )
}

