"use client"

import { useState } from "react"
import { format } from "date-fns"
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  targetState: string;
  targetCity?: string;
  createdAt: string;
  expiresAt: string;
}

interface UpdateAlertData {
  title?: string;
  description?: string;
  severity?: string;
  expiresAt?: string;
}

interface AlertsTableProps {
  alerts: Alert[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onUpdateAlert: (alertId: string, data: UpdateAlertData) => Promise<void>;
  onDeleteAlert: (alertId: string) => Promise<void>;
}

export function AlertsTable({
  alerts,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onUpdateAlert,
  onDeleteAlert
}: AlertsTableProps) {
  const [deleteAlertId, setDeleteAlertId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (alertId: string) => {
    setDeleteAlertId(alertId)
  }

  const handleConfirmDelete = async () => {
    if (!deleteAlertId) return

    try {
      setIsDeleting(true)
      await onDeleteAlert(deleteAlertId)
    } catch (error) {
      console.error("Failed to delete alert:", error)
    } finally {
      setIsDeleting(false)
      setDeleteAlertId(null)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'danger':
        return <Badge variant="destructive">{severity}</Badge>
      case 'medium':
      case 'warning':
        return <Badge variant="warning">{severity}</Badge>
      case 'low':
      case 'info':
        return <Badge variant="outline">{severity}</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <Card className="dark:bg-secondary/10">
      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="dark:bg-secondary/50">
              <TableRow className="dark:bg-secondary/50">
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Target Region</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No alerts found
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map(alert => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell>{alert.targetState}{alert.targetCity ? `, ${alert.targetCity}` : ''}</TableCell>
                    <TableCell>{format(new Date(alert.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(alert.expiresAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log("Edit alert:", alert.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(alert.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of{" "}
              <span className="font-medium">{totalCount}</span> alerts
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteAlertId !== null} onOpenChange={(open) => !open && setDeleteAlertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this alert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

