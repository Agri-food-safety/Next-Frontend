"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { AlertsHeader } from "@/components/dashboard/alerts/header"
import { AlertsTable } from "@/components/dashboard/alerts/table"
import { CreateAlertButton } from "@/components/dashboard/alerts/create-alert-button"
import { useAlerts } from "@/hooks/use-alerts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

// Metadata can't be exported from client components
// export const metadata: Metadata = {
//   title: "Alerts | AgriScan",
//   description: "Manage and send alerts to farmers",
// }

export default function AlertsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  
  // Use the alerts hook to fetch data
  const { 
    alerts, 
    totalCount, 
    isLoading, 
    error, 
    fetchAlerts, 
    createAlert, 
    updateAlert, 
    deleteAlert 
  } = useAlerts({ page: currentPage, limit: pageSize })

  console.log("Alerts:", alerts)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchAlerts({ page, limit: pageSize })
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchAlerts({ page: currentPage, limit: pageSize })
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <AlertsHeader />
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <CreateAlertButton onAlertCreated={createAlert} />
          </div>
        </div>
        
        {error ? (
          <Card className="p-8 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-muted-foreground mb-4">There was a problem loading the alerts.</p>
            <Button onClick={handleRefresh} variant="outline">
              Retry
            </Button>
          </Card>
        ) : isLoading && alerts?.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <AlertsTable
            alerts={alerts}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onUpdateAlert={updateAlert}
            onDeleteAlert={deleteAlert}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
