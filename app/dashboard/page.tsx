import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute" // Import ProtectedRoute
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardStats } from "@/components/dashboard/stats"
import { RecentReports } from "@/components/dashboard/recent-reports"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"

export const metadata: Metadata = {
  title: "Dashboard | AgriScan",
  description: "AgriScan dashboard overview",
}

export default function DashboardPage() {
  console.log("HERER");
  return (
    <ProtectedRoute> {/* Wrap content with ProtectedRoute */}
      <div className="flex flex-col gap-6 p-6">
        <DashboardHeader />
        <DashboardStats />
        <DashboardCharts />
        <RecentReports />
      </div>
    </ProtectedRoute>
  )
}
