'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Loader2, UserPlus, Phone, Lock, MapPin, User } from 'lucide-react'
import { algeriaWilayas } from '@/data/algeria-locations'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'farmer',
    city: '',
    state: '',
    gpsLat: 0,
    gpsLng: 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedWilaya, setSelectedWilaya] = useState('')
  const [availableCounties, setAvailableCounties] = useState<{ id: string; name: string }[]>([])
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gpsLat: position.coords.latitude,
            gpsLng: position.coords.longitude,
          }))
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`)
        }
      )
    }
  }, [])

  useEffect(() => {
    // Update available counties when wilaya selection changes
    if (selectedWilaya) {
      const wilaya = algeriaWilayas.find(w => w.id === selectedWilaya)
      if (wilaya) {
        setAvailableCounties(wilaya.counties)
        setFormData(prev => ({ ...prev, state: wilaya.name, city: '' }))
      } else {
        setAvailableCounties([])
      }
    } else {
      setAvailableCounties([])
    }
  }, [selectedWilaya])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
     setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleWilayaChange = (wilayaId: string) => {
    setSelectedWilaya(wilayaId)
  }

  const handleCountyChange = (countyId: string) => {
    const county = availableCounties.find(c => c.id === countyId)
    if (county) {
      setFormData(prev => ({ ...prev, city: county.name }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      await authAPI.register({
        phone: formData.phone,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        city: formData.city,
        state: formData.state,
        gpsLat: Number(formData.gpsLat) || 0,
        gpsLng: Number(formData.gpsLng) || 0,
      })
      router.push('/login?signupSuccess=true') 
    } catch (err: any) {
      setError(err?.error?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center relative overflow-hidden py-6 sm:py-12">
      {/* Background patterns */}
      <div className="pattern-grid absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"></div>
      <div className="pattern-dots absolute inset-0 opacity-5 pointer-events-none"></div>
      
      {/* Animated background circles */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-secondary/20 dark:bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      
      <div className="relative max-w-4xl mx-auto w-full px-4">
        <Card className="w-full border-none shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Image section - hidden on small screens */}
            <div className="hidden md:block md:col-span-2 relative">
              <div className="absolute inset-0">
                {/* <Image 
                  src="/images/auth/farming-login.jpg" 
                  alt="Sustainable farming" 
                  fill 
                  className="object-cover"
                  priority
                /> */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/70 to-green-800/70 mix-blend-multiply" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-white text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">Join AgriScan</h3>
                  <p className="text-sm text-white/80">Create an account to manage your farm data efficiently</p>
                </div>
              </div>
            </div>
            
            {/* Form section */}
            <div className="p-6 md:p-8 md:col-span-3">
              <div className="flex items-center justify-center mb-6 md:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
                Create an Account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                Join AgriScan today and start managing your crops better
              </p>
              
              {error && (
                <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 bg-gray-50 dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 bg-gray-50 dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 bg-gray-50 dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 bg-gray-50 dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wilaya" className="text-gray-700 dark:text-gray-300">Wilaya</Label>
                    <Select value={selectedWilaya} onValueChange={handleWilayaChange}>
                      <SelectTrigger id="wilaya" className="bg-gray-50 dark:bg-gray-800">
                        <SelectValue placeholder="Select wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {algeriaWilayas.map(wilaya => (
                          <SelectItem key={wilaya.id} value={wilaya.id}>
                            {wilaya.name} ({wilaya.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county" className="text-gray-700 dark:text-gray-300">County</Label>
                    <Select 
                      value={formData.city ? availableCounties.find(c => c.name === formData.city)?.id : ''}
                      onValueChange={handleCountyChange}
                      disabled={!selectedWilaya || availableCounties.length === 0}
                    >
                      <SelectTrigger id="county" className="bg-gray-50 dark:bg-gray-800">
                        <SelectValue placeholder={!selectedWilaya ? "Select wilaya first" : "Select county"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCounties.map(county => (
                          <SelectItem key={county.id} value={county.id}>
                            {county.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                    <Select name="role" value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <input type="hidden" name="gpsLat" value={formData.gpsLat} />
                  <input type="hidden" name="gpsLng" value={formData.gpsLng} />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
