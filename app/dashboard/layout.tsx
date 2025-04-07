import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarInset } from "@/components/ui/sidebar" // Restore import
import { LeafDecorations } from "@/components/dashboard/decorations"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Ensure the main flex container spans the full width
    <div className="flex min-h-screen w-full bg-background"> 
      <DashboardSidebar /> 
      {/* Use SidebarInset again, let its default styles apply */}
      <SidebarInset className="flex-1 relative"> 
        <LeafDecorations />
        {/* Add padding back to the container if needed */}
        <div className="dashboard-container p-6">{children}</div> 
      </SidebarInset>
    </div>
  )
}
