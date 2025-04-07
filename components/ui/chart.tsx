"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

export const ChartPie = ({ data, dataKey, nameKey, innerRadius, outerRadius, paddingAngle }: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export const ChartBar = ({ dataKey, fill, radius, data, name, stackId }: any) => {
  return <Bar dataKey={dataKey} fill={fill} radius={radius} data={data} name={name} stackId={stackId} />
}

export const ChartGrid = ({ vertical }: any) => {
  return <CartesianGrid stroke="#ccc" vertical={vertical} />
}

export const ChartXAxis = ({ dataKey }: any) => {
  return <XAxis dataKey={dataKey} />
}

export const ChartYAxis = () => {
  return <YAxis />
}

export const ChartContainer = ({ children, height }: any) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart width={500} height={300} data={[]}>
        {children}
      </BarChart>
    </ResponsiveContainer>
  )
}

export const ChartLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center">
      {payload.map((item: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center mr-4 last:mr-0">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// Export default for dynamic imports
export default {
  ChartPie,
  ChartBar,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartContainer,
  ChartLegend,
}

