"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export function MapFilters() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: new Date(),
  })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Condition Type</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="disease">Diseases</SelectItem>
                <SelectItem value="drought">Drought Stress</SelectItem>
                <SelectItem value="pest">Pest Infestation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <DateRangePicker date={date} onDateChange={setDate} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Severity Level</label>
            <Slider defaultValue={[0, 100]} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="heatmap" />
            <label htmlFor="heatmap" className="text-sm font-medium">
              Show as heatmap
            </label>
          </div>
          <Button size="sm">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}

