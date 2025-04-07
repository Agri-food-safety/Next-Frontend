'use client'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Download, Filter, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'

export function DashboardHeader() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-green-100 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome to the AgriScan inspector dashboard</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-green-200 hover:bg-green-50 hover:text-green-600 transition-colors"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-green-200 hover:bg-green-50 hover:text-green-600 transition-colors"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative border-green-200 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start py-2">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
                <span className="font-medium text-red-500">Alert:</span>
              </div>
              <span className="pl-4 mt-1 text-sm">New disease outbreak detected in Northern Region</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-2">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-2 h-2 mr-2 bg-amber-500 rounded-full"></span>
                <span className="font-medium text-amber-500">Warning:</span>
              </div>
              <span className="pl-4 mt-1 text-sm">Drought stress increasing in Eastern farms</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-2">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
                <span className="font-medium">Info:</span>
              </div>
              <span className="pl-4 mt-1 text-sm">15 new reports submitted today</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown with Logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-green-200 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
