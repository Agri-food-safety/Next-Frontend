"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, MoreHorizontal, User } from "lucide-react"

const farmers = [
  {
    id: "F-1001",
    name: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JD",
    email: "john.doe@example.com",
    phone: "+1234567890",
    region: "Northern Region",
    reports: 24,
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "F-1002",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SJ",
    email: "sarah.j@example.com",
    phone: "+1234567891",
    region: "Eastern Region",
    reports: 18,
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: "F-1003",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MC",
    email: "m.chen@example.com",
    phone: "+1234567892",
    region: "Western Region",
    reports: 12,
    lastActive: "3 days ago",
    status: "active",
  },
  {
    id: "F-1004",
    name: "Aisha Patel",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "AP",
    email: "aisha.p@example.com",
    phone: "+1234567893",
    region: "Southern Region",
    reports: 31,
    lastActive: "5 hours ago",
    status: "active",
  },
  {
    id: "F-1005",
    name: "Luis Gomez",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "LG",
    email: "luis.g@example.com",
    phone: "+1234567894",
    region: "Central Region",
    reports: 7,
    lastActive: "2 weeks ago",
    status: "inactive",
  },
]

export function FarmersTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Farmer</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Reports</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {farmers.map((farmer) => (
            <TableRow key={farmer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={farmer.avatar} alt={farmer.name} />
                    <AvatarFallback>{farmer.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{farmer.name}</p>
                    <p className="text-sm text-muted-foreground">{farmer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{farmer.region}</TableCell>
              <TableCell>{farmer.reports}</TableCell>
              <TableCell>{farmer.lastActive}</TableCell>
              <TableCell>
                <Badge variant={farmer.status === "active" ? "outline" : "secondary"}>{farmer.status}</Badge>
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
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      View Reports
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

