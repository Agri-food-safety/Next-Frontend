"use client"

import { useState, useEffect } from "react"

// Same dummy data used in the filters hook
const DUMMY_REPORTS = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    userId: "user-001",
    plantTypeId: "plant-001",
    plantType: {
      id: "plant-001",
      name: "Corn",
      scientificName: "Zea mays",
      commonDiseases: ["Rust", "Blight"]
    },
    imageUrl: "https://images.unsplash.com/photo-1601329534267-8130efe80829?q=80&w=400",
    timestamp: "2023-11-15T14:30:00Z",
    gpsLat: 36.7783,
    gpsLng: -119.4179,
    city: "Fresno",
    state: "California",
    detectionResult: "Rust",
    confidenceScore: 0.87,
    status: "submitted",
    notes: "",
    user: {
      id: "user-001",
      phone: "+12345678901",
      fullName: "John Farmer",
      role: "farmer",
      city: "Fresno",
      state: "California",
      gpsLat: 36.7783, 
      gpsLng: -119.4179,
      createdAt: "2023-01-15T00:00:00Z",
      lastActive: "2023-11-15T14:30:00Z"
    }
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    userId: "user-002",
    plantTypeId: "plant-002",
    plantType: {
      id: "plant-002",
      name: "Tomato",
      scientificName: "Solanum lycopersicum",
      commonDiseases: ["Early Blight", "Late Blight", "Leaf Spot"]
    },
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=400",
    timestamp: "2023-11-10T09:45:00Z",
    gpsLat: 37.7749,
    gpsLng: -122.4194,
    city: "San Francisco",
    state: "California",
    detectionResult: "Early Blight",
    confidenceScore: 0.76,
    status: "reviewed",
    notes: "Confirmed case of early blight. Recommended copper-based fungicide application.",
    reviewedBy: "inspector-001",
    reviewedAt: "2023-11-11T10:30:00Z",
    user: {
      id: "user-002",
      phone: "+12345678902",
      fullName: "Maria Garcia",
      role: "farmer",
      city: "San Francisco",
      state: "California",
      gpsLat: 37.7749,
      gpsLng: -122.4194,
      createdAt: "2023-02-20T00:00:00Z",
      lastActive: "2023-11-10T09:45:00Z"
    }
  },
  // ... add more dummy reports from the previous file or simply reference them
  // For brevity, I'm showing just two here
];

export function useReportDetails(reportId: string | null) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reportId) {
      setIsLoading(false)
      return
    }

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Find the report in our dummy data
        const report = DUMMY_REPORTS.find(r => r.id === reportId)
        
        if (report) {
          setData(report)
        } else {
          setError("Report not found")
        }
      } catch (err: any) {
        console.error("Error fetching report details:", err)
        setError("Failed to load report details")
      } finally {
        setIsLoading(false)
      }
    }, 1000) // Simulate network delay
    
    return () => clearTimeout(timer)
  }, [reportId])

  // Simulate updating a report
  const updateReport = async (updateData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data) {
          const updatedReport = { ...data, ...updateData }
          setData(updatedReport)
          resolve(updatedReport)
        }
      }, 800) // Simulate network delay
    })
  }

  return { 
    data, 
    isLoading, 
    error,
    updateReport // Added this method for simulating report updates
  }
}
