"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Filter, X, Loader2, RefreshCw } from "lucide-react"
import dynamic from "next/dynamic"
import { useReports } from "@/hooks/use-reports"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Update the color mapping to focus on detection types
const DETECTION_COLORS = {
  disease: "#ef4444", // red for disease
  pest: "#f97316",    // orange for pests
  drought: "#a855f7", // purple for drought
  normal: "#10b981",  // green for normal/healthy
  default: "#6366f1"  // indigo for default
}

// Report type definition for better type safety
type Report = {
  reportId: string;
  gpsLat: number;
  gpsLng: number;
  city?: string;
  state?: string;
  timestamp?: string;
  plant_detection?: {
    plant_id: string;
    name?: string;
  };
  disease_detection?: {
    disease_id: string;
    name?: string;
  };
  pest_detection?: {
    pest_id: string;
    name?: string;
  };
  drought_detection?: {
    draught_id: number;
    droughtLevel?: number;
  };
};

// Get color based on severity
function getSeverityColor(severity: string) {
  return SEVERITY_COLORS[severity.toLowerCase() as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.default
}

// Get color based on detection type
function getDetectionColor(detectionType: string) {
  return DETECTION_COLORS[detectionType as keyof typeof DETECTION_COLORS] || DETECTION_COLORS.default
}

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedPlantType, setSelectedPlantType] = useState<string>("all")
  const [selectedDetectionType, setSelectedDetectionType] = useState<string>("all")
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all") // "all", "today", "week", "month"
  const [showFilters, setShowFilters] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  
  // Preset view mode states
  const [activePreset, setActivePreset] = useState<string>("all") // "all", "disease", "pest", "drought"
  const [presetViewMode, setPresetViewMode] = useState<string>("all") // "all", "positive", "negative"
  
  // Algeria's center coordinates
  const ALGERIA_CENTER = [28.0339, 1.6596]
  const ALGERIA_ZOOM = 5
  
  // Fetch reports data
  const { reports, isLoading } = useReports()
  
  // Extract unique values for filter options
  const regions = Array.from(new Set(reports?.map(report => report.state || 'Unknown').filter(Boolean))) || []
  const plantTypes = Array.from(new Set(reports?.map(report => report.plant_detection?.name || 'Unknown').filter(Boolean))) || []

  // Count active filters
  const activeFilters = [
    selectedRegion !== "all",
    selectedSeverity !== "all",
    selectedPlantType !== "all",
    selectedDetectionType !== "all",
    selectedDateRange !== "all",
    activePreset !== "all",
    presetViewMode !== "all"
  ].filter(Boolean).length
  
  // Filter reports based on selections
  const filteredReports = reports?.filter(report => {
    if (!report || !report.gpsLat || !report.gpsLng) return false;
    
    // Get severity and detection type from report properties
    let reportSeverity = "low";
    let detectionType = "normal"; // Default to normal/healthy
    
    if (report.disease_detection) {
      reportSeverity = "high";
      detectionType = "disease";
    } else if (report.pest_detection) {
      reportSeverity = "medium";
      detectionType = "pest";
    } else if (report.drought_detection) {
      reportSeverity = "low";
      detectionType = "drought";
    }
    
    // Apply each filter
    const regionMatch = selectedRegion === "all" || report.state === selectedRegion;
    const severityMatch = selectedSeverity === "all" || reportSeverity === selectedSeverity;
    const plantTypeMatch = selectedPlantType === "all" || report.plant_detection?.name === selectedPlantType;
    const detectionTypeMatch = selectedDetectionType === "all" || detectionType === selectedDetectionType;
    
    // Date range filtering
    let dateMatch = true;
    if (selectedDateRange !== "all" && report.timestamp) {
      const reportDate = new Date(report.timestamp);
      const today = new Date();
      const now = today.getTime();
      
      if (selectedDateRange === "today") {
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
        dateMatch = reportDate.getTime() >= startOfDay && reportDate.getTime() <= now;
      } else if (selectedDateRange === "week") {
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).getTime();
        dateMatch = reportDate.getTime() >= oneWeekAgo && reportDate.getTime() <= now;
      } else if (selectedDateRange === "month") {
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).getTime();
        dateMatch = reportDate.getTime() >= oneMonthAgo && reportDate.getTime() <= now;
      }
    }
    
    // Apply preset filtering
    let presetMatch = true;
    if (activePreset !== "all") {
      // Check if report has the condition for the active preset
      const hasCondition = 
        activePreset === "disease" ? !!report.disease_detection :
        activePreset === "pest" ? !!report.pest_detection :
        activePreset === "drought" ? !!report.drought_detection : 
        false;
      
      // Apply view mode filtering
      if (presetViewMode === "positive") {
        presetMatch = hasCondition;
      } else if (presetViewMode === "negative") {
        presetMatch = !hasCondition;
      }
    }
    
    // All conditions must match
    return regionMatch && severityMatch && plantTypeMatch && detectionTypeMatch && dateMatch && presetMatch;
  }) || [];

  // Reset all filters
  const resetFilters = () => {
    setSelectedRegion("all");
    setSelectedSeverity("all");
    setSelectedPlantType("all");
    setSelectedDetectionType("all");
    setSelectedDateRange("all");
    setActivePreset("all");
    setPresetViewMode("all");
  };

  // Reset preset filters only
  const resetPresetView = () => {
    setActivePreset("all");
    setPresetViewMode("all");
  };

  // Helper function for getting preset label
  const getPresetLabel = () => {
    if (activePreset === "all") return "All Reports";
    
    const conditionLabel = activePreset.charAt(0).toUpperCase() + activePreset.slice(1);
    
    if (presetViewMode === "all") return `${conditionLabel} - All`;
    if (presetViewMode === "positive") return `${conditionLabel} - Yes`;
    if (presetViewMode === "negative") return `${conditionLabel} - No`;
    
    return "Custom View";
  };

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
        zIndex: 9999,
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
        isFullScreen ? "fixed inset-0 z-[9999] m-0 rounded-none border-0" : "flex-1"
      }`}
    >
      <div ref={mapRef} className="relative w-full" style={mapContainerStyle as React.CSSProperties}>
        {isClient && (
          <>
            {/* View Mode Preset Controls */}
            <div className="absolute left-4 top-4 z-[1000]">
              <div className="flex flex-col gap-2">
                <div className="rounded-md bg-white p-2 shadow-md">
                  <div className="mb-1 text-xs font-medium text-gray-600">View Mode</div>
                  <Tabs 
                    value={activePreset} 
                    onValueChange={setActivePreset} 
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="disease">Disease</TabsTrigger>
                      <TabsTrigger value="pest">Pests</TabsTrigger>
                      <TabsTrigger value="drought">Drought</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {activePreset !== "all" && (
                    <div className="mt-2">
                      <Tabs
                        value={presetViewMode}
                        onValueChange={setPresetViewMode}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="positive">Yes</TabsTrigger>
                          <TabsTrigger value="negative">No</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  )}
                  
                  {(activePreset !== "all" || presetViewMode !== "all") && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetPresetView} 
                      className="mt-2 h-7 w-full text-xs bg-blue-600"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Reset View
                    </Button>
                  )}
                </div>
                
                {/* Active preset indicator */}
                <div className="rounded-md bg-white p-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-600">Active View:</div>
                    <Badge variant={activePreset !== "all" ? "default" : "outline"} className="text-xs">
                      {getPresetLabel()}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Showing {filteredReports.length} reports
                  </div>
                </div>
              </div>
            </div>

            {/* Move legend to top right */}
            <div className="absolute bottom-4 right-16 flex flex-col gap-2 z-[1000]">
              {(
                <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md text-black">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: DETECTION_COLORS.disease }}></div>
                  <span className="text-xs">Disease</span>
                </div>
              )}
              
              {(
                <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md text-black">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: DETECTION_COLORS.pest }}></div>
                  <span className="text-xs">Pest</span>
                </div>
              )}
              
              {(
                <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md text-black">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: DETECTION_COLORS.drought }}></div>
                  <span className="text-xs">Drought</span>
                </div>
              )}
              
              { (
                <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md text-black">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: DETECTION_COLORS.normal }}></div>
                  <span className="text-xs">Normal/Healthy</span>
                </div>
              )}
            </div>

            <MapContainer
              center={ALGERIA_CENTER}
              zoom={ALGERIA_ZOOM}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              whenCreated={(map) => {
                setTimeout(() => {
                  map.invalidateSize();
                }, 100);
              }}
            >
              <TileLayer
                attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <ZoomControl position="bottomright" />

              {filteredReports.length > 0 && filteredReports.map((report) => {
                if (!report.gpsLat || !report.gpsLng) return null;
                
                // Determine detection type and condition
                let detectionType = "normal";
                let condition = "Healthy";
                let severity = "low";
                
                if (report.disease_detection?.name) {
                  detectionType = "disease";
                  condition = report.disease_detection.name;
                  severity = "high";
                } else if (report.pest_detection?.name) {
                  detectionType = "pest";
                  condition = report.pest_detection.name;
                  severity = "medium";
                } else if (report.drought_detection) {
                  detectionType = "drought";
                  condition = `Drought Level ${report.drought_detection.droughtLevel}`;
                  severity = "low";
                }
                
                const markerColor = getDetectionColor(detectionType);
                
                return (
                  <CircleMarker
                    key={report.reportId}
                    center={[report.gpsLat, report.gpsLng]}
                    radius={severity === "high" ? 12 : severity === "medium" ? 10 : 8}
                    pathOptions={{
                      fillColor: markerColor,
                      color: markerColor,
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
                            style={{ backgroundColor: markerColor }}
                          ></span>
                          <span className="capitalize">{detectionType} Detection</span>
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Filter indicator - moved to top */}
            {activeFilters > 0 && (
              <div className="absolute right-4 top-28 z-30">
                <Badge className="bg-green-600 hover:bg-green-700">
                  {activeFilters} {activeFilters === 1 ? 'filter' : 'filters'} active
                </Badge>
              </div>
            )}

            {/* Full screen toggle button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-[1000] bg-white shadow-md hover:bg-green-50"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {/* Filter toggle button */}
            <Button
              variant="secondary"
              size="icon"
              className={`absolute right-4 top-16 z-30 bg-white shadow-md hover:bg-green-50 ${
                activeFilters > 0 ? 'ring-2 ring-green-600' : ''
              }`}
              onClick={toggleFilters}
            >
              {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </Button>

            {/* Enhanced filters panel */}
            {showFilters && (
              <div className="bg-secondary/10 absolute right-4 top-16 z-40 flex max-h-[80vh] flex-col gap-4 overflow-y-auto rounded-md bg-white p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Advanced Filters</h3>
                  {activeFilters > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Reset All
                    </Button>
                  )}
                </div>
                
                {/* Region filter */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[200px]">
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
                
                {/* Plant Type filter */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Plant Type</label>
                  <Select value={selectedPlantType} onValueChange={setSelectedPlantType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Plant Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plant Types</SelectItem>
                      {plantTypes.map(plant => (
                        <SelectItem key={plant} value={plant}>{plant}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Detection Type filter */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Detection Type</label>
                  <Select value={selectedDetectionType} onValueChange={setSelectedDetectionType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Detection Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-black" value="all">All Detection Types</SelectItem>
                      <SelectItem className="text-black"  value="disease">Disease</SelectItem>
                      <SelectItem className="text-black"  value="pest">Pest</SelectItem>
                      <SelectItem className="text-black"  value="drought">Drought</SelectItem>
                      <SelectItem className="text-black"  value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Severity filter */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Severity</label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-[200px]">
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
                
                {/* Date Range filter */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Date Range</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-2 text-center text-xs text-gray-500">
                  Showing {filteredReports.length} of {reports?.length || 0} reports
                </div>
              </div>
            )}
          </>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
