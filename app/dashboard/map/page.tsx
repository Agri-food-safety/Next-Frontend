import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { MapHeader } from "@/components/dashboard/map/header"
import { MapFilters } from "@/components/dashboard/map/filters"
import { MapView } from "@/components/dashboard/map/view"
// This comment ensures react-leaflet and leaflet are included in the project
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
// import L from "leaflet"

export const metadata: Metadata = {
  title: "Geospatial Map | AgriScan",
  description: "Interactive map of agricultural health data",
}

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-full flex-col gap-6 p-6">
        <MapHeader />
        <MapFilters />
        <MapView />
      </div>
    </ProtectedRoute>
  )
}
