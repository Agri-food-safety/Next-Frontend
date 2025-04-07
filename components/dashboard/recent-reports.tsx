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
  id: string;
  farmerId: string;
  farmerName: string;
  plantType: string;
  condition: string;
  severity: string;
  city: string;
  state: string;
  timestamp: string;
  status: string;
}

export function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoading(true);
        const response = await reportsAPI.getReports({ page_size: 5 });

        // Transform data to match our component's expected format
        const formattedReports = response.data.data.results.map((report: any) => ({
          id: report.id,
          farmerId: report.farmer_id,
          farmerName: report.farmer_name,
          plantType: report.plant_type,
          condition: report.condition,
          severity: report.severity,
          city: report.city,
          state: report.state,
          timestamp: report.timestamp,
          status: report.status,
        }));

        setReports(formattedReports);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch recent reports:", err);
        setError(err?.error?.message || "Failed to load recent reports");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm dark:bg-secondary/10 dark:border-secondary/10">
      <CardHeader className="flex flex-row items-center">
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
          {loading ? (
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
                key={report.id}
                className="flex items-center justify-between space-x-4 rounded-lg border border-green-100 dark:border-secondary/10 p-4 transition-all hover:bg-green-50/50 dark:hover:bg-secondary/20 hover:shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-700">{getInitials(report.farmerName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none dark:text-gray-200">{report.farmerName}</p>
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
                  <Link href={`/dashboard/reports/${report.id}`} passHref>
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

