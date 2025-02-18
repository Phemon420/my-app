"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useToast } from "@/hooks/use-toast"
import useSWR from 'swr'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC0CB",
  "#A52A2A",
  "#008080",
  "#800080",
]

const processTransactionData = (transactions) => {
  const categoryTotals = {}
  transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized'
    categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.amount)
  })
  //console.log(categoryTotals);
  return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
}

const fetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch chart data')
  }
  return response.json()
}

export default function CategoryPieChart() {

  const { data, error, isLoading } = useSWR("/api/transactions/category", fetcher, {
    fallbackData: [],
    revalidateOnMount: true
  })

  const { toast } = useToast()
  
  if (isLoading) return <p>Loading chart...</p>
  if (error) {
    toast({ title: "Error", description: "Failed to fetch chart data", variant: "destructive" })
    return <p className="text-red-500">Error loading chart</p>
  }

  const rawData = Array.isArray(data) ? data : data?.transactions || []
  const chartData = processTransactionData(rawData)
  //console.log(chartData);

  return (
    <Card className="w-full h-96">
  <CardHeader>
    <CardTitle>Category-wise Expenses</CardTitle>
  </CardHeader>
  <CardContent>
    {chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />

            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p>No transaction data available</p>
    )}
  </CardContent>
</Card>

  )
}