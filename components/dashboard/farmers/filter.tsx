"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function FarmersFilter() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search farmers..." className="pl-8" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          <SelectItem value="northern">Northern</SelectItem>
          <SelectItem value="eastern">Eastern</SelectItem>
          <SelectItem value="western">Western</SelectItem>
          <SelectItem value="southern">Southern</SelectItem>
          <SelectItem value="central">Central</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="active">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button className="shrink-0">Apply Filters</Button>
    </div>
  )
}

