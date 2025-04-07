'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
    console.log("Auth", isAuthenticated, loading)
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
    if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [isAuthenticated, loading, router, user?.role, requiredRole])

  if (loading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return <>{children}</>
}
