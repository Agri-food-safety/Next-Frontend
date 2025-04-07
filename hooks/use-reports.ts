"use client"

import { useState, useEffect } from 'react';
import { reportsAPI } from '@/lib/api';

interface Detection {
  name: string;
  confidence: number;
}

interface PlantDetection extends Detection {
  plantId: string;
}

interface DiseaseDetection extends Detection {
  diseaseId: string;
}

interface PestDetection extends Detection {
  pestId: string;
}

interface DroughtDetection {
  confidence: number;
  description: string;
  droughtLevel: number;
}

interface Report {
  reportId: string;
  status: string;
  gpsLat: number;
  gpsLng: number;
  city: string;
  state: string;
  imageUrl?: string;
  plant_detection: PlantDetection;
  disease_detection: DiseaseDetection;
  pest_detection: PestDetection;
  drought_detection: DroughtDetection;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string;
  timestamp: string;
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
      console.log("RESp:", response?.data)
      // Adapt the response data to our expected format
      const formattedReports = response?.data?.data?.reports;


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
