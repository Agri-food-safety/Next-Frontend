"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal } from "lucide-react"

const reports = [
  {
    id: "REP-1234",
    farmer: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    plant: "Maize",
    condition: "Leaf Blight",
    conditionType: "disease",
    severity: "High",
    location: "Northern Region, Sector 3",
    date: "2023-04-05",
    status: "Verified",
  },
  {
    id: "REP-1233",
    farmer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    plant: "Rice",
    condition: "Drought Stress",
    conditionType: "drought",
    severity: "Medium",
    location: "Eastern Region, Sector 7",
    date: "2023-04-05",
    status: "Pending",
  },
  {
    id: "REP-1232",
    farmer: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
    plant: "Wheat",
    condition: "Rust",
    conditionType: "disease",
    severity: "Low",
    location: "Western Region, Sector 2",
    date: "2023-04-04",
    status: "Verified",
  },
  {
    id: "REP-1231",
    farmer: {
      name: "Aisha Patel",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AP",
    },
    plant: "Cassava",
    condition: "Pest Infestation",
    conditionType: "pest",
    severity: "High",
    location: "Southern Region, Sector 5",
    date: "2023-04-04",
    status: "Verified",
  },
  {
    id: "REP-1230",
    farmer: {
      name: "Luis Gomez",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "LG",
    },
    plant: "Tomato",
    condition: "Powdery Mildew",
    conditionType: "disease",
    severity: "Medium",
    location: "Central Region, Sector 1",
    date: "2023-04-03",
    status: "Verified",
  },
]

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "high":
      return "destructive"
    case "medium":
      return "warning"
    case "low":
      return "secondary"
    default:
      return "secondary"
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "verified":
      return "success"
    case "pending":
      return "warning"
    default:
      return "secondary"
  }
}

export function ReportsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report ID</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Plant</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={report.farmer.avatar} alt={report.farmer.name} />
                    <AvatarFallback>{report.farmer.initials}</AvatarFallback>
                  </Avatar>
                  <span>{report.farmer.name}</span>
                </div>
              </TableCell>
              <TableCell>{report.plant}</TableCell>
              <TableCell>{report.condition}</TableCell>
              <TableCell>
                <Badge variant={getSeverityColor(report.severity)}>{report.severity}</Badge>
              </TableCell>
              <TableCell>{report.location}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
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

