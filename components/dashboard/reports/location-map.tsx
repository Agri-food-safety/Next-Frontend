"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { Loader2 } from "lucide-react"

// Fix for Leaflet marker icons in Next.js
// Using a customized leaflet marker that matches our design
const markerIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2316a34a' width='36' height='36'%3E%3Cpath fill-rule='evenodd' d='M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z' clip-rule='evenodd'/%3E%3C/svg%3E",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -34],
})

interface ReportLocationMapProps {
  lat: number
  lng: number
}

export default function ReportLocationMap({ lat, lng }: ReportLocationMapProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    )
  }
  
  // Custom map style URL for a cleaner look
  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileUrl}
      />
      <ZoomControl position="bottomright" />
      <Marker position={[lat, lng]} icon={markerIcon}>
        <Popup className="rounded-lg shadow-lg">
          <div className="p-1 text-sm">
            <strong>Report Location</strong><br />
            <span className="text-muted-foreground">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
