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
      <SidebarHeader className="flex items-center px-6 py-4 bg-white">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white">
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
      <SidebarContent className="p-4 bg-gray-50">
        <SidebarMenu>
          {[
            { href: "/dashboard", icon: Home, label: "Dashboard" },
            { href: "/dashboard/map", icon: Map, label: "Map View" },
            { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
            { href: "/dashboard/farmers", icon: Users, label: "Farmers" },
            { href: "/dashboard/reports", icon: FileText, label: "Reports" },
          ].map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="group flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg border border-gray-200"
              >
                <Link href={item.href} className="w-full">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white group-hover:bg-green-50 transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-green-600 group-hover:text-green-700" />
                  </div>
                  <span className="text-base font-medium text-gray-800 group-hover:text-green-700">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="group flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg border border-gray-200"
            >
              <Link href="/dashboard/settings" className="w-full">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white group-hover:bg-green-50 transition-colors duration-300">
                  <Settings className="h-5 w-5 text-green-600 group-hover:text-green-700" />
                </div>
                <span className="text-base font-medium text-gray-800 group-hover:text-green-700">
                  Settings
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
