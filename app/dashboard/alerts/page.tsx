import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute" // Import ProtectedRoute
import { AlertsHeader } from "@/components/dashboard/alerts/header"
import { AlertsTable } from "@/components/dashboard/alerts/table"
import { CreateAlertButton } from "@/components/dashboard/alerts/create-alert-button"

export const metadata: Metadata = {
  title: "Alerts | AgriScan",
  description: "Manage and send alerts to farmers",
}

export default function AlertsPage() {
  return (
    <ProtectedRoute> {/* Wrap content */}
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <AlertsHeader />
          <CreateAlertButton />
        </div>
        <AlertsTable />
      </div>
    </ProtectedRoute>
  )
}
