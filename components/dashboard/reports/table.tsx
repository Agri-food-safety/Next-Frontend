"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"

interface Report {
  reportId: string;
  status: string;
  gpsLat: number;
  gpsLng: number;
  city: string;
  state: string;
  imageUrl?: string;
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
  reviewNotes: string;
  timestamp: string;
}

interface ReportsTableProps {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ReportsTable({ 
  reports = [], // Add default empty array to prevent undefined errors
  isLoading, 
  error,
  totalCount = 0, // Add default for totalCount as well
  currentPage = 1,
  pageSize = 10,
  onPageChange
}: ReportsTableProps) {
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Function to determine report condition and severity
  function getConditionInfo(report: Report) {
    if (report.disease_detection?.name) {
      return {
        condition: report.disease_detection.name,
        severity: 'high'
      };
    }
    if (report.pest_detection?.name) {
      return {
        condition: report.pest_detection.name,
        severity: 'medium'
      };
    }
    if (report.drought_detection) {
      return {
        condition: `Drought level ${report.drought_detection.droughtLevel}`,
        severity: 'low'
      };
    }
    return {
      condition: 'Healthy',
      severity: 'success'
    };
  }

  // Function to get status badge variant
  function getStatusVariant(status: string) {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'reviewing': return 'warning';
      case 'pending': return 'outline';
      case 'submitted': return 'secondary'; // Add handling for 'submitted' status
      default: return 'secondary';
    }
  }

  // Function to get severity badge variant
  function getSeverityVariant(severity: string) {
    switch (severity.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'outline';
      default: return 'success';
    }
  }

  return (
    <Card className="overflow-hidden border-green-100 dark:border-secondary/10">
      <CardContent className="p-0">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-muted-foreground mb-4">There was a problem loading the reports data.</p>
            <Button 
              onClick={() => onPageChange(currentPage)} 
              variant="outline" 
              className="border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/10">
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">Plant</TableHead>
                    <TableHead className="font-medium">Condition</TableHead>
                    <TableHead className="font-medium">Location</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Skeleton loading state
                    Array(pageSize).fill(0).map((_, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-9 w-9 ml-auto rounded-md" /></TableCell>
                      </TableRow>
                    ))
                  ) : !reports || reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                          <p className="text-lg font-medium">No reports found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map(report => {
                      const { condition, severity } = getConditionInfo(report);
                      return (
                        <TableRow key={report.reportId} className="hover:bg-muted/30">
                          <TableCell>
                            {format(new Date(report.timestamp), 'MMM dd, yyyy')}
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(report.timestamp), 'HH:mm')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {report.plant_detection?.name || "Unknown"}
                            {report.plant_detection?.confidence && (
                              <div className="text-xs text-muted-foreground">
                                {(report.plant_detection.confidence * 100).toFixed(0)}% confidence
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getSeverityVariant(severity)}>{condition}</Badge>
                          </TableCell>
                          <TableCell>
                            {report.city || "Unknown"}, {report.state || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(report.status)} className="capitalize">
                              {report.status}
                            </Badge>
                            {report.reviewedBy && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Reviewed by {report.reviewedBy}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/reports/${report.reportId}`} passHref>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="hover:bg-green-50 hover:text-green-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {!isLoading && reports && reports.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between py-4 px-4 border-t border-green-100 dark:border-secondary/10">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of{" "}
                  <span className="font-medium">{totalCount}</span> reports
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

