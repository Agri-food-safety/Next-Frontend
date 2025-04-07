"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { useReportDetails } from "@/hooks/use-report-details"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { reportsAPI } from "@/lib/api"
import { ArrowLeft, Loader2, MapPin, Calendar, User, Leaf, CheckCircle, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"
import Link from 'next/link'
import { Report } from "@/components/dashboard/recent-reports"

// Dynamically load the map component to prevent SSR issues
const ReportLocationMap = dynamic(() => import("@/components/dashboard/reports/location-map"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted/30 flex items-center justify-center rounded-xl">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
})

function getSeverityStyle(confidenceScore: number) {
  if (confidenceScore >= 0.8) {
    return "destructive" // High severity
  } else if (confidenceScore >= 0.5) {
    return "warning" // Medium severity
  } else {
    return "success" // Low severity
  }
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = typeof params.id === 'string' ? params.id : null
  
  const { data: report, isLoading, error } = useReportDetails(reportId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewStatus, setReviewStatus] = useState('reviewed')
  const [reviewNotes, setReviewNotes] = useState('')

  // Pre-fill review form if report is already reviewed
  useEffect(() => {
    if (report && report_?.status === 'reviewed') {
      setReviewStatus(report_?.status)
      setReviewNotes(report_?.notes || '')
    }

    console.log("REPORTSS", report);
  }, [report])

  const handleReviewSubmit = async () => {
    if (!reportId) return
    
    try {
      setIsSubmitting(true)
      await reportsAPI.updateReportStatus(reportId, {
        status: reviewStatus,
        reviewNotes: reviewNotes
      })
      // Refresh data
      router.refresh()
    } catch (error) {
      console.error('Failed to update report status:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading report details...</p>
        </div>
      </div>
    )
  }



  if (!report) {
    return (
      <div className="container py-12 px-4">
        <Card className="max-w-md mx-auto overflow-hidden border-none shadow-lg bg-white/90 backdrop-blur-sm dark:bg-secondary/10">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-medium mb-2">Report Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested report could not be found or you may not have permission to view it.</p>
            <Button asChild variant="outline" className="transition-all duration-300 hover:bg-primary/10">
              <Link href="/dashboard/reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  console.log("Report Details:", report)
  const report_ = report?.data?.data as Report;
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="mb-8 ">
          <Button 
            asChild 
            variant="ghost" 
            className="group flex items-center transition-all duration-300 hover:bg-primary/10"
          >
            <Link href="/dashboard/reports">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Reports</span>
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card className="dark:bg-secondary/10 overflow-hidden border-none shadow-md bg-white/95 backdrop-blur-sm rounded-xl">
              <CardHeader className="dark:bg-primary/10 border-b border-gray-100 bg-primary/5  backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-primary text-xl text-gray-800">Report #{ report_?.reportId.slice(0, 8)}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Submitted on {format(new Date(report_?.timestamp), "PPP 'at' p")}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={report_?.status === 'reviewed' ? 'success' : 'warning'} 
                    className="capitalize px-3 py-1 text-xs font-medium rounded-full shadow-sm"
                  >
                    {report_?.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm mb-8">
                  {report_?.imageUrl ? (
                    <Image
                      src={report_?.imageUrl}
                      alt="Plant image"
                      fill
                      className="object-cover transition-all hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted/30">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="bg-primary/5 p-4 rounded-xl">
                    <h3 className="flex items-center text-sm font-medium text-gray-700 mb-4 dark:text-primary">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Leaf className="h-4 w-4 text-primary " />
                      </div>
                      Plant Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{report_?.plant_detection?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scientific Name:</span>
                        <span className="italic">{report_?.plant_detection?.name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-xl">
                    <h3 className="flex  dark:text-primary items-center text-sm font-medium text-gray-700 mb-4">
                      <div className=" bg-primary/10 p-2 rounded-full mr-3">
                        <AlertCircle className="h-4 w-4 text-primary dark:text-primary bg-primary/5" />
                      </div>
                      Detection Results
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="font-medium">{report_?.disease_detection?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Confidence:</span>
                        <Badge variant={getSeverityStyle(report_?.disease_detection?.confidence!)} className="rounded-full px-2">
                          {Math.round(report_?.disease_detection?.confidence! * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 grid gap-8 md:grid-cols-2 mt-8">
                  <div className="p-4 rounded-xl">
                    <h3 className="flex items-center text-sm font-medium text-gray-700 mb-4 dark:text-primary">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <User className="h-4 w-4 text-gray-700 text-primary" />
                      </div>
                      Submitted By
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{report_?.farmerName || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{report_?.farmerName?.phone || '+213 553286504'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dark:bg-secondary/5 bg-gray-50/80 p-4 rounded-xl">
                    <h3 className="flex items-center text-sm font-medium text-gray-700 mb-4 dark:text-primary">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Calendar className="h-4 w-4 text-gray-700 text-primary" />
                      </div>
                      Timestamps
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Submitted:</span>
                        <span>{format(new Date(report_?.timestamp), "PPP")}</span>
                      </div>
                      {report_?.reviewedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reviewed:</span>
                          <span>{format(new Date(report_?.reviewedAt), "PPP")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {report_?.reviewNotes && (
                  <div className="dark:bg-secondary/10 mt-8 bg-muted/30 p-4 rounded-xl border border-muted">
                    <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2 dark:text-primary">
                      <CheckCircle className="mr-2 h-4 w-4 text-success" />
                      Review Notes
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{report_?.reviewNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="dark:bg-secondary/10 overflow-hidden border-none shadow-md bg-white/95 backdrop-blur-sm rounded-xl">
              <CardHeader className="dark:bg-secondary/10  border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                <CardTitle className="flex items-center text-xl text-gray-800 dark:text-primary">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <MapPin className="h-4 w-4 text-primary dark:text-primary" />
                  </div>
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="dark:bg-secondary/10 bg-gray-50/80 p-4 rounded-xl mb-6">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="block text-muted-foreground mb-1">City</span>
                      <span className="font-medium">{report_?.city}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground mb-1">State</span>
                      <span className="font-medium">{report_?.state}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground mb-1">Coordinates</span>
                      <span className="font-medium">{report_?.gpsLat.toFixed(6)}, {report_?.gpsLng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[350px] w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                  <ReportLocationMap lat={report_?.gpsLat} lng={report_?.gpsLng} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="dark:bg-secondary/10 sticky top-6 overflow-hidden border-none shadow-md bg-white/95 backdrop-blur-sm rounded-xl">
              <CardHeader className="border-b border-gray-100 bg-primary/5">
                <CardTitle className="dark:text-primary text-lg text-gray-800">Review Report</CardTitle>
                <CardDescription>Update status and add notes</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700 dark:text-white">Status</Label>
                    <Select 
                      value={reviewStatus} 
                      onValueChange={setReviewStatus}
                    >
                      <SelectTrigger id="status" className="rounded-lg border-gray-200 bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700 dark:text-white">Review Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this report_?..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={5}
                      className="resize-none rounded-lg border-gray-200 bg-white"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  onClick={handleReviewSubmit} 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 rounded-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Save Review'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
