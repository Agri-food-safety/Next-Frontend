"use client";
import { useState, useEffect } from 'react';
import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { ReportsHeader } from "@/components/dashboard/reports/header"
import { ReportsTable } from "@/components/dashboard/reports/table"
import { ReportsFilter } from "@/components/dashboard/reports/filter"
import { useReports } from "@/hooks/use-reports";

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    plantType: '',
    state: '',
    status: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Convert filters to API parameters
  const getFilterParams = () => {
    const params: Record<string, any> = {
      page: currentPage,
      page_size: pageSize
    };
    
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;
    if (filters.plantType) params.plant_type = filters.plantType;
    if (filters.state) params.state = filters.state;
    if (filters.status) params.status = filters.status;
    
    return params;
  };

  // Use the reports hook with our filter parameters
  const { reports, totalCount, isLoading, error, fetchReports } = useReports(getFilterParams());

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Refetch when filters or page changes
  useEffect(() => {
    fetchReports(getFilterParams());
  }, [filters, currentPage]);

  // Handle filter changes from filter component
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 p-6">
        <ReportsHeader />
        <ReportsFilter onFilterChange={handleFilterChange} />
        <ReportsTable 
          reports={reports || []}
          isLoading={isLoading}
          error={error}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </ProtectedRoute>
  );
}
