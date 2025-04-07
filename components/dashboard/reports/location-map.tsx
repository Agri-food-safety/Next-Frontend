"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { Loader2 } from "lucide-react"

// Fix for Leaflet marker icons in Next.js
const markerIcon = new Icon({
  iconUrl: "/marker-icon.png",  // You'll need to add this image to your public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
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
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <Marker position={[lat, lng]} icon={markerIcon}>
        <Popup>
          Report Location<br />
          Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
