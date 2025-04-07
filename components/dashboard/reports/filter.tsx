"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useState } from "react"

export function ReportsFilter() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: new Date(),
  })

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Input placeholder="Search reports..." />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Condition type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          <SelectItem value="disease">Disease</SelectItem>
          <SelectItem value="drought">Drought</SelectItem>
          <SelectItem value="pest">Pest</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <DateRangePicker date={date} onDateChange={setDate} />
      <Button className="shrink-0">Apply Filters</Button>
    </div>
  )
}

