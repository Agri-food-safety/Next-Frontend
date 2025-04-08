"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  TooltipProps
} from "recharts"

// Helper components for Chart
export function ChartContainer({
  children,
  height = 400,
}: {
  children: React.ReactNode
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  )
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: payload[0].color }}
            />
            <span className="text-sm text-muted-foreground">
              {payload[0].name || payload[0].dataKey}
            </span>
          </div>
          <div className="text-right text-sm font-medium">
            {payload[0].value}
          </div>
        </div>
      </div>
    )
  }
  return null
}

// Complete bar chart implementation - all in one component
export function BarChart3({
  data,
  height = 300,
  series,
  index,
  grid = true,
  legend = true,
  legendVertical = false
}: {
  data: any[]
  height?: number
  series: { dataKey: string; name?: string; color: string; stackId?: string }[]
  index: string
  grid?: boolean
  legend?: boolean
  legendVertical?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        {series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name || s.dataKey}
            fill={s.color}
            stackId={s.stackId}
            radius={[4, 4, 0, 0]}
          />
        ))}
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip />}
        />
        {legend && (
          <Legend
            layout={legendVertical ? "vertical" : "horizontal"}
            verticalAlign={legendVertical ? "middle" : "bottom"}
            align={legendVertical ? "right" : "center"}
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}

// Complete pie chart implementation - all in one component
export function PieChart3({
  data,
  height = 300,
  dataKey,
  nameKey,
  colorKey = "color",
  innerRadius = "60%",
  outerRadius = "80%",
  legend = true
}: {
  data: any[]
  height?: number
  dataKey: string
  nameKey: string
  colorKey?: string
  innerRadius?: string | number
  outerRadius?: string | number
  legend?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          cornerRadius={4}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry[colorKey] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
            />
          ))}
        </Pie>
        <Tooltip 
          content={(props) => {
            const { active, payload } = props;
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: payload[0].payload[colorKey] }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {payload[0].name}
                      </span>
                    </div>
                    <div className="text-right text-sm font-medium">
                      {payload[0].value}
                    </div>
                  </div>
                </div>
              )
            }
            return null;
          }} 
        />
        {legend && (
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}

// Keep old components for backward compatibility, but they may not work with dynamic imports
export function BarChartContainer({
  children,
  data,
}: {
  children: React.ReactNode
  data: any[]
}) {
  return (
    <BarChart data={data}>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: payload[0].color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {payload[0].name || payload[0].dataKey}
                    </span>
                  </div>
                  <div className="text-right text-sm font-medium">
                    {payload[0].value}
                  </div>
                </div>
              </div>
            )
          }

          return null
        }}
      />
      {children}
    </BarChart>
  )
}

export function ChartBar({
  dataKey,
  name,
  fill = "#10b981",
  radius = 0,
  stackId,
}: {
  dataKey: string
  name?: string
  fill?: string
  radius?: number
  stackId?: string
}) {
  return <Bar dataKey={dataKey} name={name} fill={fill} radius={radius} stackId={stackId} />
}

export function ChartGrid({ horizontal = true, vertical = true }) {
  return <CartesianGrid strokeDasharray="3 3" horizontal={horizontal} vertical={vertical} />
}

export function ChartXAxis({ dataKey }: { dataKey: string }) {
  return <XAxis dataKey={dataKey} />
}

export function ChartYAxis() {
  return <YAxis />
}

export function ChartLegend({ vertical = true, iconSize = 10, iconType = "square" }) {
  return <Legend 
    layout={vertical ? "vertical" : "horizontal"} 
    verticalAlign={vertical ? "middle" : "bottom"} 
    align={vertical ? "right" : "center"}
    iconSize={iconSize}
    iconType={iconType} 
  />
}

// Keep existing ChartPie for backward compatibility
export function ChartPie({
  data,
  dataKey,
  nameKey,
  colorKey = "color",
  innerRadius = 0,
  outerRadius = "80%",
  paddingAngle = 0,
  cornerRadius = 0,
}: {
  data: any[]
  dataKey: string
  nameKey: string
  colorKey?: string
  innerRadius?: string | number
  outerRadius?: string | number
  paddingAngle?: number
  cornerRadius?: number
}) {
  return (
    <PieChart>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        paddingAngle={paddingAngle}
        cornerRadius={cornerRadius}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry[colorKey] || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
        ))}
      </Pie>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: payload[0].payload[colorKey] }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {payload[0].name}
                    </span>
                  </div>
                  <div className="text-right text-sm font-medium">
                    {payload[0].value}
                  </div>
                </div>
              </div>
            )
          }

          return null
        }}
      />
    </PieChart>
  )
}

