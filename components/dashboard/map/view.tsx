"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Filter, X } from "lucide-react"
import dynamic from "next/dynamic"
import { useReports } from "@/hooks/use-reports"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })

// Severity color mapping
const SEVERITY_COLORS = {
  high: "#ef4444", // red-500
  medium: "#f59e0b", // amber-500
  low: "#10b981", // green-500
  default: "#6366f1" // indigo-500
}

// Get color based on severity
function getSeverityColor(severity: string) {
  return SEVERITY_COLORS[severity.toLowerCase() as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.default
}

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  
  // Fetch reports data
  const { data: reports, isLoading } = useReports()
  
  // Get unique regions from reports
  const regions = Array.from(new Set(reports?.map(report => report.region) || []))
  
  // Filter reports based on selections
  const filteredReports = reports?.filter(report => {
    const regionMatch = selectedRegion === "all" || report.region === selectedRegion
    const severityMatch = selectedSeverity === "all" || report.severity === selectedSeverity
    return regionMatch && severityMatch
  }) || []

  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen)
  const toggleFilters = () => setShowFilters(!showFilters)

  const mapContainerStyle = isFullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        width: "100vw",
        height: "100vh",
      }
    : {
        height: "500px",
        width: "100%",
      }

  return (
    <Card
      className={`overflow-hidden border-green-100 bg-white/80 backdrop-blur-sm ${
        isFullScreen ? "fixed inset-0 z-50 m-0 rounded-none border-0" : "flex-1"
      }`}
    >
      <div ref={mapRef} className="relative w-full" style={mapContainerStyle as React.CSSProperties}>
        {isClient ? (
          <>
            <MapContainer
              center={[7.5, -1.0]} // Center on Ghana
              zoom={7}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />

              {filteredReports.map((report) => (
                <CircleMarker
                  key={report.id}
                  center={[report.latitude, report.longitude]}
                  radius={report.severity === "high" ? 12 : report.severity === "medium" ? 10 : 8}
                  pathOptions={{
                    fillColor: getSeverityColor(report.severity),
                    color: getSeverityColor(report.severity),
                    fillOpacity: 0.7,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-medium">{report.condition}</h3>
                      <p className="text-sm text-muted-foreground">Region: {report.region}</p>
                      <p className="text-sm text-muted-foreground">Date: {new Date(report.date).toLocaleDateString()}</p>
                      <p className="mt-1 flex items-center text-sm">
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: getSeverityColor(report.severity) }}
                        ></span>
                        <span className="capitalize">{report.severity} Severity</span>
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            {/* Full screen toggle button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10 bg-white shadow-md hover:bg-green-50"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {/* Filter toggle button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-16 z-10 bg-white shadow-md hover:bg-green-50"
              onClick={toggleFilters}
            >
              {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </Button>

            {/* Filters panel */}
            {showFilters && (
              <div className="absolute left-4 top-4 z-10 flex flex-col gap-4 rounded-md bg-white p-4 shadow-md">
                <div className="space-y-2">
                  <Label className="text-sm">Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Severity</Label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-xs">High Severity</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-xs">Medium Severity</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Low Severity</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </Card>
  )
}
