"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Filter, X, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useReports } from "@/hooks/use-reports"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Add Leaflet CSS import
import "leaflet/dist/leaflet.css"

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
  const [mapError, setMapError] = useState<string | null>(null)
  
  // Fetch reports data
  const { reports, isLoading } = useReports()
  
  // Transform reports for mapping - extract state as region
  const regions = Array.from(new Set(reports?.map(report => report.state || 'Unknown') || []))
  
  // Filter reports based on selections
  const filteredReports = reports?.filter(report => {
    if (!report || !report.gpsLat || !report.gpsLng) return false;
    
    // Get severity from disease_detection, pest_detection, or drought_detection
    let reportSeverity = "low";
    if (report.disease_detection) {
      reportSeverity = "high";
    } else if (report.pest_detection) {
      reportSeverity = "medium";
    }
    
    const regionMatch = selectedRegion === "all" || report.state === selectedRegion
    const severityMatch = selectedSeverity === "all" || reportSeverity === selectedSeverity
    return regionMatch && severityMatch
  }) || []

  useEffect(() => {
    setIsClient(true)
    
    // Ensure map container has proper dimensions
    if (mapRef.current) {
      const resizeMap = () => {
        if (mapRef.current) {
          const containerHeight = isFullScreen ? window.innerHeight : 500;
          mapRef.current.style.height = `${containerHeight}px`;
        }
      };
      
      resizeMap();
      window.addEventListener('resize', resizeMap);
      
      return () => window.removeEventListener('resize', resizeMap);
    }
  }, [isFullScreen]);

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

  // Show loading state while data is being fetched
  if (!isClient) {
    return (
      <Card className="flex-1 overflow-hidden border-green-100 bg-white/80 backdrop-blur-sm">
        <div className="flex h-[500px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  // Handle error state
  if (mapError) {
    return (
      <Card className="flex-1 overflow-hidden border-green-100 bg-white/80 backdrop-blur-sm">
        <div className="flex h-[500px] w-full flex-col items-center justify-center p-4 text-center">
          <p className="text-red-500">Error loading map: {mapError}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden border-green-100 bg-white/80 backdrop-blur-sm ${
        isFullScreen ? "fixed inset-0 z-50 m-0 rounded-none border-0" : "flex-1"
      }`}
    >
      <div ref={mapRef} className="relative w-full" style={mapContainerStyle as React.CSSProperties}>
        {isClient && (
          <>
            <MapContainer
              center={[7.5, -1.0]} // Center on Ghana
              zoom={7}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              whenCreated={(map) => {
                setTimeout(() => {
                  map.invalidateSize();
                }, 100);
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />

              {filteredReports.length > 0 && filteredReports.map((report) => {
                if (!report.gpsLat || !report.gpsLng) return null;
                
                // Determine severity based on detections
                let severity = "low";
                let condition = "Healthy";
                
                if (report.disease_detection?.name) {
                  severity = "high";
                  condition = report.disease_detection.name;
                } else if (report.pest_detection?.name) {
                  severity = "medium";
                  condition = report.pest_detection.name;
                } else if (report.drought_detection) {
                  severity = "low";
                  condition = `Drought Level ${report.drought_detection.droughtLevel}`;
                }
                
                return (
                  <CircleMarker
                    key={report.reportId}
                    center={[report.gpsLat, report.gpsLng]}
                    radius={severity === "high" ? 12 : severity === "medium" ? 10 : 8}
                    pathOptions={{
                      fillColor: getSeverityColor(severity),
                      color: getSeverityColor(severity),
                      fillOpacity: 0.7,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="p-1">
                        <h3 className="font-medium">{report.plant_detection?.name || "Unknown Plant"}</h3>
                        <p className="text-sm text-muted-foreground">{condition}</p>
                        <p className="text-sm text-muted-foreground">Location: {report.city || 'Unknown'}, {report.state || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">Date: {report.timestamp ? new Date(report.timestamp).toLocaleDateString() : 'Unknown'}</p>
                        <p className="mt-1 flex items-center text-sm">
                          <span
                            className="mr-1 inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: getSeverityColor(severity) }}
                          ></span>
                          <span className="capitalize">{severity} Severity</span>
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
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
                  <label className="text-sm">Region</label>
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
                  <label className="text-sm">Severity</label>
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
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
