'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from "lucide-react" // Add import for loading icon

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: string
}) {
  const { user, isAuthenticated, loading } = useAuth()

  const router = useRouter()

  useEffect(() => {
    // Remove console log in production code
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
    if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [isAuthenticated, loading, router, user?.role, requiredRole])

  if (loading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
        <p className="text-lg text-green-800 dark:text-green-400">Loading dashboard...</p>
      </div>
    )
  }

  return <>{children}</>
}
