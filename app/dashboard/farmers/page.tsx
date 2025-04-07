import type { Metadata } from "next"
import { FarmersHeader } from "@/components/dashboard/farmers/header"
import { FarmersTable } from "@/components/dashboard/farmers/table"
import { FarmersFilter } from "@/components/dashboard/farmers/filter"

export const metadata: Metadata = {
  title: "Farmers | AgriScan",
  description: "View and manage farmer accounts and reports",
}

export default function FarmersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <FarmersHeader />
      <FarmersFilter />
      <FarmersTable />
    </div>
  )
}

