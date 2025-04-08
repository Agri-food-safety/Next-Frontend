"use client"

import dynamic from "next/dynamic"
import { DiseaseDistribution } from "./disease-distribution"
import { RegionalHeatmap } from "./regional-heatmap"

// Dynamically import chart components with SSR disabled

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <DiseaseDistribution />
      <RegionalHeatmap />
    </div>
  )
}

