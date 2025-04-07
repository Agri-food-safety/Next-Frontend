import { useState, useEffect } from 'react';
import { statsAPI } from '@/lib/api';
import { useReports } from './use-reports';
import { useDiseases } from './use-diseases';
import { useAlerts } from './use-alerts';

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
 
    const {reports} = useReports();
    const {alerts} = useAlerts();
    
  return {
    totalReports: reports?.length,
    reportsThisWeek: alerts?.length,

  };
}
