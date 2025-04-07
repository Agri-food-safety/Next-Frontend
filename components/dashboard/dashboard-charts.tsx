"use client"

import dynamic from "next/dynamic"

// Dynamically import chart components with SSR disabled
const DiseaseDistribution = dynamic(
  () => import("@/components/dashboard/disease-distribution").then((mod) => mod.DiseaseDistribution),
  { ssr: false },
)

const RegionalHeatmap = dynamic(
  () => import("@/components/dashboard/regional-heatmap").then((mod) => mod.RegionalHeatmap),
  { ssr: false },
)

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <DiseaseDistribution />
      <RegionalHeatmap />
    </div>
  )
}

