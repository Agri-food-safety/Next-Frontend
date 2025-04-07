import type { Metadata } from "next"
import { ReportsHeader } from "@/components/dashboard/reports/header"
import { ReportsTable } from "@/components/dashboard/reports/table"
import { ReportsFilter } from "@/components/dashboard/reports/filter"

export const metadata: Metadata = {
  title: "Reports | AgriScan",
  description: "View all submitted plant health reports",
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ReportsHeader />
      <ReportsFilter />
      <ReportsTable />
    </div>
  )
}

