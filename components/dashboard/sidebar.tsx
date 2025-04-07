"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, FileText, Home, Leaf, Map, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            AgriScan
          </span>
        </Link>
        <div className="ml-auto md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard" className="group">
              <Link href="/dashboard">
                <div className="flex items-center justify-center w-5 h-5 rounded-md group-hover:bg-green-100 group-hover:text-green-600 transition-colors duration-200">
                  <Home className="h-4 w-4" />
                </div>
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/map"} tooltip="Map View" className="group">
              <Link href="/dashboard/map">
                <div className="flex items-center justify-center w-5 h-5 rounded-md group-hover:bg-green-100 group-hover:text-green-600 transition-colors duration-200">
                  <Map className="h-4 w-4" />
                </div>
                <span>Map View</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/alerts"} tooltip="Alerts" className="group">
              <Link href="/dashboard/alerts">
                <div className="flex items-center justify-center w-5 h-5 rounded-md group-hover:bg-green-100 group-hover:text-green-600 transition-colors duration-200">
                  <Bell className="h-4 w-4" />
                </div>
                <span>Alerts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/farmers"} tooltip="Farmers" className="group">
              <Link href="/dashboard/farmers">
                <div className="flex items-center justify-center w-5 h-5 rounded-md group-hover:bg-green-100 group-hover:text-green-600 transition-colors duration-200">
                  <Users className="h-4 w-4" />
                </div>
                <span>Farmers</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/reports"} tooltip="Reports" className="group">
              <Link href="/dashboard/reports">
                <div className="flex items-center justify-center w-5 h-5 rounded-md group-hover:bg-green-100 group-hover:text-green-600 transition-colors duration-200">
                  <FileText className="h-4 w-4" />
                </div>
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" className="group">
              <Link href="/dashboard/settings">
                <div className="flex items-center justify-center w-5 h-5 rounded-md group-hover:bg-green-100 group-hover:text-green-600 transition-colors duration-200">
                  <Settings className="h-4 w-4" />
                </div>
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

