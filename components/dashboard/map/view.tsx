"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components with no SSR to avoid hydration issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })

// Sample data for map markers
const mapPoints = [
  {
    id: 1,
    position: [8.5, -1.2],
    severity: "high",
    condition: "Leaf Blight",
    region: "Northern Region",
    reports: 24,
  },
  {
    id: 2,
    position: [7.8, 1.5],
    severity: "medium",
    condition: "Drought Stress",
    region: "Eastern Region",
    reports: 18,
  },
  {
    id: 3,
    position: [6.2, -2.8],
    severity: "low",
    condition: "Rust",
    region: "Western Region",
    reports: 12,
  },
  {
    id: 4,
    position: [5.5, 0.2],
    severity: "high",
    condition: "Pest Infestation",
    region: "Southern Region",
    reports: 31,
  },
  {
    id: 5,
    position: [7.1, -0.5],
    severity: "medium",
    condition: "Powdery Mildew",
    region: "Central Region",
    reports: 15,
  },
  {
    id: 6,
    position: [8.2, -0.8],
    severity: "high",
    condition: "Leaf Blight",
    region: "Northern Region",
    reports: 19,
  },
  {
    id: 7,
    position: [7.5, 1.2],
    severity: "medium",
    condition: "Drought Stress",
    region: "Eastern Region",
    reports: 14,
  },
  {
    id: 8,
    position: [6.5, -2.5],
    severity: "low",
    condition: "Rust",
    region: "Western Region",
    reports: 8,
  },
  {
    id: 9,
    position: [5.8, 0.5],
    severity: "high",
    condition: "Pest Infestation",
    region: "Southern Region",
    reports: 27,
  },
  {
    id: 10,
    position: [7.3, -0.3],
    severity: "low",
    condition: "Powdery Mildew",
    region: "Central Region",
    reports: 11,
  },
]

// Get color based on severity
function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "high":
      return "#ef4444" // red-500
    case "medium":
      return "#f59e0b" // amber-500
    case "low":
      return "#10b981" // green-500
    default:
      return "#6366f1" // indigo-500
  }
}

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Toggle full screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Define map styles based on full screen state
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

              {mapPoints.map((point) => (
                <CircleMarker
                  key={point.id}
                  center={point.position as [number, number]}
                  radius={point.severity === "high" ? 12 : point.severity === "medium" ? 10 : 8}
                  pathOptions={{
                    fillColor: getSeverityColor(point.severity),
                    color: getSeverityColor(point.severity),
                    fillOpacity: 0.7,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-medium">{point.condition}</h3>
                      <p className="text-sm text-muted-foreground">Region: {point.region}</p>
                      <p className="text-sm text-muted-foreground">Reports: {point.reports}</p>
                      <p className="mt-1 flex items-center text-sm">
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: getSeverityColor(point.severity) }}
                        ></span>
                        <span className="capitalize">{point.severity} Severity</span>
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

