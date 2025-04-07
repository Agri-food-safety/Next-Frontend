import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"

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
    severity: "High",
    location: "Northern Region, Sector 3",
    date: "2 hours ago",
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
    severity: "Medium",
    location: "Eastern Region, Sector 7",
    date: "5 hours ago",
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
    severity: "Low",
    location: "Western Region, Sector 2",
    date: "Yesterday",
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
    severity: "High",
    location: "Southern Region, Sector 5",
    date: "Yesterday",
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
    severity: "Medium",
    location: "Central Region, Sector 1",
    date: "2 days ago",
  },
]

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

export function RecentReports() {
  return (
    <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle className="text-lg font-semibold text-green-800">Recent Reports</CardTitle>
          <CardDescription>Latest plant health reports submitted by farmers</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-green-200 hover:bg-green-50 hover:text-green-600 transition-colors"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between space-x-4 rounded-lg border border-green-100 p-4 transition-all hover:bg-green-50/50 hover:shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={report.farmer.avatar} alt={report.farmer.name} />
                  <AvatarFallback className="bg-green-100 text-green-700">{report.farmer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{report.farmer.name}</p>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm font-medium leading-none">{report.plant}</p>
                  <p className="text-sm text-muted-foreground">{report.condition}</p>
                </div>
                <Badge variant={getSeverityColor(report.severity)} className="capitalize">
                  {report.severity}
                </Badge>
                <p className="hidden text-sm text-muted-foreground md:block">{report.date}</p>
                <Button variant="ghost" size="icon" className="hover:bg-green-100 hover:text-green-600">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

