'use client'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton' // For loading state

export default function ProfilePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-1/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    // Should be handled by ProtectedRoute, but good fallback
    return <div className="p-6">User not found. Please log in.</div> 
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{user.fullName}</CardTitle>
          <CardDescription>Manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={user.fullName} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={user.phone} readOnly />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.role} readOnly className="capitalize" />
            </div>
             <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={user.city || 'N/A'} readOnly />
            </div>
             <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" value={user.state || 'N/A'} readOnly />
            </div>
             <div>
              <Label htmlFor="location">Location (Lat, Lng)</Label>
              <Input 
                id="location" 
                value={user.gpsLat && user.gpsLng ? `${user.gpsLat.toFixed(4)}, ${user.gpsLng.toFixed(4)}` : 'N/A'} 
                readOnly 
              />
            </div>
          </div>
          <div className="pt-4">
             {/* Placeholder for edit functionality */}
            <Button disabled>Edit Profile</Button> 
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
