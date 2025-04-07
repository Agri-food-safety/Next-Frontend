"use client";

import { AlertTriangle, BarChart3, FileText, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReports } from "@/hooks/use-reports"
import { useDashboardData } from "@/hooks/use-dashboard-data";

export function DashboardStats() {
  const { totalReports, reportsThisWeek } = useDashboardData();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="stat-card card-hover border-green-100 dark:border-secondary/10 bg-white/80 dark:bg-secondary/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <FileText className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReports}</div>
          <div className="flex items-center mt-1">
            <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
              <svg className="mr-1 h-3 w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.5 6.5L5 4L9.5 8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              12%
            </div>
            <p className="ml-2 text-xs text-muted-foreground">from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card className=" dark:bg-secondary/10 dark:border-secondary/10 stat-card stat-card-farmers card-hover border-green-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
          <div className="flex items-center mt-1">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
              <svg className="mr-1 h-3 w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.5 6.5L5 4L9.5 8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              5%
            </div>
            <p className="ml-2 text-xs text-muted-foreground">from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-secondary/10 dark:border-secondary/10 stat-card stat-card-alerts card-hover border-green-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disease Alerts</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reportsThisWeek}</div>
          <div className="flex items-center mt-1">
            <div className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              <span className="font-bold mr-1">+</span>3
            </div>
            <p className="ml-2 text-xs text-muted-foreground">new alerts today</p>
          </div>
        </CardContent>
      </Card>
      <Card className="dark:bg-secondary/10 dark:border-secondary/10 stat-card stat-card-regions card-hover border-green-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Affected Regions</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <BarChart3 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <div className="flex items-center mt-1">
            <div className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
              <span className="font-bold mr-1">+</span>2
            </div>
            <p className="ml-2 text-xs text-muted-foreground">from last week</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

