"use client"

import { useState, useEffect } from 'react';
import { diseasesAPI } from '@/lib/api';

interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string;
  treatment: string;
  severity: string;
  plantType: string;
  imageUrl?: string;
}

interface DiseasesResponse {
  diseases: Disease[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  fetchDiseases: (params?: any) => Promise<void>;
}

export function useDiseases(initialParams?: any): DiseasesResponse {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiseases = async (params?: any) => {
    try {
      setIsLoading(true);
      const response = await diseasesAPI.getDiseases(params);
      
      // Adapt the response data to our disease format
      const formattedDiseases = response.data.data.results.map((disease: any) => ({
        id: disease.id,
        name: disease.name,
        description: disease.description,
        symptoms: disease.symptoms || '',
        treatment: disease.treatment,
        severity: disease.severity,
        plantType: disease.plant_type,
        imageUrl: disease.image_url
      }));

      setDiseases(formattedDiseases);
      setTotalCount(response.data.data.count);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch diseases:', err);
      setError(err?.error?.message || 'Failed to load diseases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases(initialParams);
  }, []);

  return {
    diseases,
    totalCount,
    isLoading,
    error,
    fetchDiseases
  };
}
