"use client"

import { useState, useEffect } from "react"
import { reportsAPI } from "@/lib/api"

interface Report {
  id: string
  latitude: number
  longitude: number
  severity: "high" | "medium" | "low"
  condition: string
  region: string
  date: string
}

export function useReports() {
  const [data, setData] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportsAPI.getReports()
        setData(response.data as Report[])
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  return { data, isLoading }
}
