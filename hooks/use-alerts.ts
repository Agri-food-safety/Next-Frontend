"use client"

import { useState, useEffect } from 'react';
import { alertsAPI } from '@/lib/api';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  targetState: string;
  targetCity?: string;
  createdAt: string;
  expiresAt: string;
}

interface CreateAlertData {
  title: string;
  description: string;
  severity: string;
  targetState: string;
  targetCity?: string;
  expiresAt: string;
}

interface UpdateAlertData {
  title?: string;
  description?: string;
  severity?: string;
  expiresAt?: string;
}

interface AlertsResponse {
  alerts: Alert[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  fetchAlerts: (params?: any) => Promise<void>;
  createAlert: (alertData: CreateAlertData) => Promise<void>;
  updateAlert: (alertId: string, alertData: UpdateAlertData) => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
}

export function useAlerts(initialParams?: any): AlertsResponse {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async (params?: any) => {
    try {
      setIsLoading(true);
      const response = await alertsAPI.getAlerts(params);
      
      // Convert API response to our Alert interface format
      const formattedAlerts = response.data.data.results.map((alert: any) => ({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        targetState: alert.target_state || alert.targetState,
        targetCity: alert.target_city || alert.targetCity,
        createdAt: alert.created_at || alert.createdAt,
        expiresAt: alert.expires_at || alert.expiresAt
      }));

      setAlerts(formattedAlerts);
      setTotalCount(response?.data?.data?.count || formattedAlerts?.length);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch alerts:', err);
      setError(err?.message || 'Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const createAlert = async (alertData: CreateAlertData) => {
    try {
      setIsLoading(true);
      await alertsAPI.createAlert({
        title: alertData.title,
        description: alertData.description,
        severity: alertData.severity,
        targetState: alertData.targetState,
        targetCity: alertData.targetCity,
        expiresAt: alertData.expiresAt
      });
      // Refresh the alerts list after creating
      await fetchAlerts();
    } catch (err: any) {
      console.error('Failed to create alert:', err);
      setError(err?.message || 'Failed to create alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlert = async (alertId: string, alertData: UpdateAlertData) => {
    try {
      setIsLoading(true);
      await alertsAPI.updateAlert(alertId, alertData);
      // Refresh the alerts list after updating
      await fetchAlerts();
    } catch (err: any) {
      console.error(`Failed to update alert ${alertId}:`, err);
      setError(err?.message || 'Failed to update alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      setIsLoading(true);
      await alertsAPI.deleteAlert(alertId);
      // Remove the deleted alert from the state directly for immediate UI response
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setTotalCount(prev => prev - 1);
    } catch (err: any) {
      console.error(`Failed to delete alert ${alertId}:`, err);
      setError(err?.message || 'Failed to delete alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(initialParams);
  }, []);

  return {
    alerts,
    totalCount,
    isLoading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert
  };
}
