'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 text-center bg-white rounded-lg shadow-md">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full mt-6"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
