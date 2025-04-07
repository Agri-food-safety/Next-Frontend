"use client";
import { useState } from 'react';
import { mockReports, plantTypes, states, Report } from '@/lib/mock-data';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { ReportsHeader } from "@/components/dashboard/reports/header"
import { ReportsTable } from "@/components/dashboard/reports/table"
import { ReportsFilter } from "@/components/dashboard/reports/filter"

// export const metadata: Metadata = {
//   title: "Reports | AgriScan",
//   description: "View all submitted plant health reports",
// }

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    plantType: '',
    state: '',
    status: ''
  });

  const filteredReports = mockReports.filter(report => {
    const reportDate = new Date(report.timestamp);
    const matchesDateFrom = !filters.dateFrom || reportDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || reportDate <= new Date(filters.dateTo);
    const matchesPlantType = !filters.plantType || report.plantType === filters.plantType;
    const matchesState = !filters.state || report.state === filters.state;
    const matchesStatus = !filters.status || report.status === filters.status;

    return matchesDateFrom && matchesDateTo && matchesPlantType && matchesState && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 p-6">
        <ReportsHeader />
        <ReportsFilter />
        <ReportsTable />
      </div>
    </ProtectedRoute>
  )
}
