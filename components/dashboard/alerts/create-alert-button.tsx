"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BellPlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function CreateAlertButton() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Alert created",
      description: "Your alert has been sent to farmers in the selected region.",
      className: "bg-green-50 border-green-200",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <BellPlus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>Send an alert to farmers in affected regions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                placeholder="E.g., Urgent: Disease Outbreak"
                required
                className="border-green-200 focus-visible:ring-green-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Alert Type</Label>
              <Select required defaultValue="warning">
                <SelectTrigger id="type" className="border-green-200 focus-visible:ring-green-500">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="danger" className="text-red-500 font-medium">
                    Danger (High Priority)
                  </SelectItem>
                  <SelectItem value="warning" className="text-amber-500 font-medium">
                    Warning (Medium Priority)
                  </SelectItem>
                  <SelectItem value="info" className="text-blue-500 font-medium">
                    Information (Low Priority)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region">Target Region</Label>
              <Select required>
                <SelectTrigger id="region" className="border-green-200 focus-visible:ring-green-500">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="northern">Northern Region</SelectItem>
                  <SelectItem value="eastern">Eastern Region</SelectItem>
                  <SelectItem value="western">Western Region</SelectItem>
                  <SelectItem value="southern">Southern Region</SelectItem>
                  <SelectItem value="central">Central Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Alert Message</Label>
              <Textarea
                id="message"
                placeholder="Enter detailed alert message..."
                className="min-h-[100px] border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Send Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

