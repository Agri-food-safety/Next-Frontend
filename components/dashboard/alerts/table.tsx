"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Trash } from "lucide-react"

const alerts = [
  {
    id: "ALT-1234",
    title: "Urgent: Leaf Blight Outbreak",
    type: "danger",
    region: "Northern Region",
    recipients: 124,
    date: "2 hours ago",
    status: "active",
  },
  {
    id: "ALT-1233",
    title: "Warning: Drought Stress Increasing",
    type: "warning",
    region: "Eastern Region",
    recipients: 87,
    date: "5 hours ago",
    status: "active",
  },
  {
    id: "ALT-1232",
    title: "Pest Migration Alert",
    type: "warning",
    region: "Western Region",
    recipients: 56,
    date: "Yesterday",
    status: "active",
  },
  {
    id: "ALT-1231",
    title: "New Treatment Available for Rust",
    type: "info",
    region: "All Regions",
    recipients: 573,
    date: "2 days ago",
    status: "active",
  },
  {
    id: "ALT-1230",
    title: "Heavy Rain Warning",
    type: "warning",
    region: "Southern Region",
    recipients: 92,
    date: "3 days ago",
    status: "expired",
  },
]

function getAlertTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "danger":
      return "destructive"
    case "warning":
      return "warning"
    case "info":
      return "secondary"
    default:
      return "secondary"
  }
}

export function AlertsTable() {
  const [tableAlerts, setTableAlerts] = useState(alerts)

  const handleDelete = (id: string) => {
    setTableAlerts(tableAlerts.filter((alert) => alert.id !== id))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableAlerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.id}</TableCell>
              <TableCell>{alert.title}</TableCell>
              <TableCell>
                <Badge variant={getAlertTypeColor(alert.type)}>{alert.type}</Badge>
              </TableCell>
              <TableCell>{alert.region}</TableCell>
              <TableCell>{alert.recipients}</TableCell>
              <TableCell>{alert.date}</TableCell>
              <TableCell>
                <Badge variant={alert.status === "active" ? "outline" : "secondary"}>{alert.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(alert.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Alert
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

