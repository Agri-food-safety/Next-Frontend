import { useState, useEffect } from 'react';
import { statsAPI } from '@/lib/api';

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  reportsThisWeek: number;
  totalFarmers: number;
  severityDistribution: Record<string, number>;
  plantTypeDistribution: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardStats {
  const [stats, setStats] = useState<Omit<DashboardStats, 'isLoading' | 'error'>>({
    totalReports: 0,
    pendingReports: 0,
    reportsThisWeek: 0,
    totalFarmers: 0,
    severityDistribution: {},
    plantTypeDistribution: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await statsAPI.getDashboardStats();
        setStats(response.data.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err?.error?.message || 'Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return {
    ...stats,
    isLoading,
    error,
  };
}
