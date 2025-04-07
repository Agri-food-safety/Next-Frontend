"use client"

import { useState, useEffect } from 'react';
import { reportsAPI } from '@/lib/api';

interface Report {
  id: string;
  farmerId: string;
  farmerName: string;
  plantType: string;
  condition: string;
  severity: string;
  location: string;
  city: string;
  state: string;
  timestamp: string;
  status: string;
  imageUrl?: string;
}

interface ReportsResponse {
  reports: Report[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  fetchReports: (params?: any) => Promise<void>;
}

export function useReports(initialParams?: any): ReportsResponse {
  const [reports, setReports] = useState<Report[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (params?: any) => {
    try {
      setIsLoading(true);
      const response = await reportsAPI.getReports(params);
      
      // Adapt the response data to our expected format
      const formattedReports = response.data.data.results.map((report: any) => ({
        id: report.id,
        farmerId: report.farmer_id,
        farmerName: report.farmer_name,
        plantType: report.plant_type,
        condition: report.condition,
        severity: report.severity,
        location: `${report.city}, ${report.state}`,
        city: report.city,
        state: report.state,
        timestamp: report.timestamp,
        status: report.status,
        imageUrl: report.image_url
      }));

      setReports(formattedReports);
      setTotalCount(response.data.data.count);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch reports:', err);
      setError(err?.error?.message || 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(initialParams);
  }, []);

  return {
    reports,
    totalCount,
    isLoading,
    error,
    fetchReports
  };
}
