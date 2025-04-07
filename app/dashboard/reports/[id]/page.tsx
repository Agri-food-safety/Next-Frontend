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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { reportsAPI } from "@/lib/api"
import { ArrowLeft, Loader2, MapPin, Calendar, User, Leaf, CheckCircle, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"
import Link from 'next/link'
import { mockReports } from '@/lib/mock-data'

// Dynamically load the map component to prevent SSR issues
const ReportLocationMap = dynamic(() => import("@/components/dashboard/reports/location-map"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin" />
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
    if (report && report.status === 'reviewed') {
      setReviewStatus(report.status)
      setReviewNotes(report.notes || '')
    }
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

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">Report not found</h1>
          <Link href="/dashboard/reports" className="text-indigo-600 hover:text-indigo-900 mt-4 inline-block">
            ← Back to Reports
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-6">
          <Link href="/dashboard/reports" className="text-indigo-600 hover:text-indigo-900">
            ← Back to Reports
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Report #{report.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      Submitted on {format(new Date(report.timestamp), "PPP 'at' p")}
                    </CardDescription>
                  </div>
                  <Badge variant={report.status === 'reviewed' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  {report.imageUrl ? (
                    <Image
                      src={report.imageUrl}
                      alt="Plant image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                      <Leaf className="mr-2 h-4 w-4" />
                      Plant Details
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Type:</span> {report.plantType?.name || 'Unknown'}</p>
                      <p><span className="font-medium">Scientific Name:</span> {report.plantType?.scientificName || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Detection Results
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Condition:</span> {report.detectionResult}</p>
                      <p>
                        <span className="font-medium">Confidence:</span>{' '}
                        <Badge variant={getSeverityStyle(report.confidenceScore)}>
                          {Math.round(report.confidenceScore * 100)}%
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Submitted By
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Name:</span> {report.user?.fullName || 'Unknown'}</p>
                      <p><span className="font-medium">Phone:</span> {report.user?.phone || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Timestamps
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Submitted:</span> {format(new Date(report.timestamp), "PPP")}</p>
                      {report.reviewedAt && (
                        <p><span className="font-medium">Reviewed:</span> {format(new Date(report.reviewedAt), "PPP")}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {report.notes && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Review Notes
                      </h3>
                      <div className="mt-2 rounded-md bg-muted p-3">
                        <p>{report.notes}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p><span className="font-medium">City:</span> {report.city}</p>
                    <p><span className="font-medium">State:</span> {report.state}</p>
                    <p><span className="font-medium">Coordinates:</span> {report.gpsLat.toFixed(6)}, {report.gpsLng.toFixed(6)}</p>
                  </div>
                </div>
                
                <div className="h-[300px] w-full overflow-hidden rounded-md border">
                  <ReportLocationMap lat={report.gpsLat} lng={report.gpsLng} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Review Report</CardTitle>
                <CardDescription>Update the status and add notes to this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={reviewStatus} 
                      onValueChange={setReviewStatus}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Review Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this report..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleReviewSubmit} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Review
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
