"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  BarChart3, 
  FileText, 
  Home, 
  Leaf, 
  MapPin, 
  Bell, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { authAPI } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Check if we're on a larger screen
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    
    // Set initial value
    checkScreenSize()
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize)
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  // Close mobile menu on navigation or on large screens
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, isLargeScreen])
  
  // Mock user for now
  useEffect(() => {
    setUser({
      fullName: "John Farmer",
      role: "inspector"
    })
  }, [])
  
  const handleLogout = async () => {
    try {
      await authAPI.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Map View', href: '/dashboard/map', icon: MapPin },
    { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
    { name: 'Farmers', href: '/dashboard/farmers', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ]

  return (
    <div className="w-full flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar for desktop */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 lg:static lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full overflow-y-auto bg-white shadow-xl rounded-r-3xl">
          {/* Mobile close button */}
          <div className="absolute top-4 right-4 lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          
          {/* Logo */}
          <div className="flex h-16 items-center px-6 py-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                AgriScan
              </span>
            </Link>
          </div>
          
          {/* User info */}
          <div className="mx-3 my-6">
            <div className="rounded-xl bg-primary/5 p-4">
              {user && (
                <div className="flex flex-col items-start">
                  <p className="font-medium text-gray-800">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="mx-3 bg-gray-100" />
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors duration-200",
                        isActive 
                          ? "text-primary" 
                          : "text-gray-400 group-hover:text-primary/70"
                      )} 
                      aria-hidden="true" 
                    />
                    {item.name}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
          
          <div className="px-3 py-4 mt-auto">
            <Separator className="mb-4 bg-gray-100" />
            
            {/* Settings link */}
            <Link
              href="/dashboard/settings"
              className={cn(
                "group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                pathname === '/dashboard/settings'
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Settings
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  pathname === '/dashboard/settings'
                    ? "text-gray-900" 
                    : "text-gray-400 group-hover:text-gray-700"
                )} 
                aria-hidden="true" 
              />
              Settings
            </Link>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="mt-2 w-full group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut
                className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500 transition-colors duration-200" 
                aria-hidden="true" 
              />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col w-full">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm px-4 sm:px-6 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-700"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          
          <div className="flex flex-1 items-center gap-x-4">
            <div className="flex flex-shrink-0 items-center gap-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                AgriScan
              </span>
            </div>
          </div>
        </div>

        {/* Main content area with subtle decoration */}
        <main className="flex-1 overflow-y-auto pb-10 w-full">
          {/* Decorative background elements */}
          <div className="fixed top-[10%] right-[5%] w-80 h-80 bg-primary/5 rounded-full filter blur-3xl opacity-50 -z-10"></div>
          <div className="fixed bottom-[10%] left-[5%] w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl opacity-50 -z-10"></div>
          
          {/* Content container */}
          <div className="relative z-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
