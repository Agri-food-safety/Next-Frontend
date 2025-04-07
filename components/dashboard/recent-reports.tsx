"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { reportsAPI } from "@/lib/api"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useReports } from "@/hooks/use-reports"

// Helper function to get initials from name
function getInitials(name: string): string {
  if (!name) return '';

  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "high":
      return "destructive"
    case "medium":
      return "warning"
    case "low":
      return "success"
    default:
      return "secondary"
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs} seconds ago`;
  } else if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return `Yesterday`;
  } else {
    return `${diffDays} days ago`;
  }
}

interface Report {
  reportId: string;
  status: string;
  gpsLat: number;
  gpsLng: number;
  city: string;
  state: string;
  imageUrl: string;
  plant_detection: {
    name: string;
    plantId: string;
    confidence: number;
  };
  disease_detection?: {
    name: string;
    diseaseId: string;
    confidence: number;
  };
  pest_detection?: {
    name: string;
    pestId: string;
    confidence: number;
  };
  drought_detection?: {
    confidence: number;
    description: string;
    droughtLevel: number;
  };
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  timestamp: string;
  // For backward compatibility with our component
  farmerId?: string; 
  farmerName?: string;
}

export function RecentReports() {
  const {reports: apiReports, isLoading, error} = useReports({page_size: 5});
  
  // Transform the API reports to match our component's needs
  const reports = apiReports.map(report => ({
    ...report,
    id: report.reportId, // For any existing references to id
    plantType: report.plant_detection.name || "Unknown plant",
    condition: report.disease_detection?.name || report.pest_detection?.name || 
               (report.drought_detection ? `Drought level ${report.drought_detection.droughtLevel}` : "Healthy"),
    severity: report.disease_detection?.name ? "high" : 
              report.pest_detection?.name ? "medium" : 
              report.drought_detection ? "low" : "info"
  }));

  console.log("Reports:", reports, apiReports);

  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm dark:bg-secondary/10 dark:border-secondary/10">
      <CardHeader className="flex flex-row justify-between items-center w-full">
        <div>
          <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-400">Recent Reports</CardTitle>
          <CardDescription>Latest plant health reports submitted by farmers</CardDescription>
        </div>
        <Link href="/dashboard/reports" passHref>
          <Button
            variant="outline"
            size="sm"
            className="dark:border-secondary/10 ml-auto border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors"
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between space-x-4 rounded-lg border border-green-100 dark:border-secondary/10 p-4"
              >
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="hidden h-4 w-16 md:block" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            reports.map((report) => (
              <div
                key={report.reportId}
                className="flex items-center justify-between space-x-4 rounded-lg border border-green-100 dark:border-secondary/10 p-4 transition-all hover:bg-green-50/50 dark:hover:bg-secondary/20 hover:shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {report.farmerName ? getInitials(report.farmerName) : "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none dark:text-gray-200">
                      {report.farmerName || "Unknown Farmer"}
                    </p>
                    <p className="text-sm text-muted-foreground">{report.city}, {report.state}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <p className="text-sm font-medium leading-none dark:text-gray-200">{report.plantType}</p>
                    <p className="text-sm text-muted-foreground">{report.condition}</p>
                  </div>
                  <Badge variant={getSeverityColor(report.severity)} className="capitalize">
                    {report.severity}
                  </Badge>
                  <p className="hidden text-sm text-muted-foreground md:block">{formatTimeAgo(report.timestamp)}</p>
                  <Link href={`/dashboard/reports/${report.reportId}`} passHref>
                    <Button variant="ghost" size="icon" className="hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

