"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, LogIn, Lock, Phone } from "lucide-react"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast-provider"

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || !password) {
      toast({
        title: "Validation Error",
        description: "Phone and password are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await authAPI.login({ phone, password })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
      
      <div className="relative sm:max-w-lg sm:mx-auto w-full px-4">
        <Card className="w-full border-none shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Image section - hidden on small screens */}
            <div className="hidden md:block md:col-span-2 relative">
              <div className="absolute inset-0">
                <Image 
                  src="/images/auth/farming-login.jpg" 
                  alt="Sustainable farming" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/70 to-green-800/70 mix-blend-multiply" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-white text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <LogIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">Welcome Back</h3>
                  <p className="text-sm text-white/80">Sign in to access your AgriScan dashboard</p>
                </div>
              </div>
            </div>
            
            {/* Form section */}
            <div className="p-6 md:p-8 md:col-span-3">
              <div className="flex items-center justify-center mb-6 md:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <LogIn className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
                Sign in to AgriScan
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                Enter your credentials to access your account
              </p>
              
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                      <Link 
                        href="/forgot-password" 
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link 
                      href="/signup" 
                      className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
