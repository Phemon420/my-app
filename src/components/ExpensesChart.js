"use client"

import useSWR from "swr"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useToast } from "@/hooks/use-toast"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-foreground">
          Total: ${payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

const processTransactionData = (transactions) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentYear = new Date().getFullYear()

  // Initialize array with all 12 months
  const monthlyExpenses = months.map(month => ({
    month,
    totalExpenses: 0
  }))

  // Sum spending per month
  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const year = date.getFullYear()
    const monthIndex = date.getMonth()
    if (year === currentYear) {
      monthlyExpenses[monthIndex].totalExpenses += Math.abs(transaction.amount)
    }
  })

  return monthlyExpenses
}

const fetcher = async (url) => {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

export default function ExpensesChart() {
  const { data, error, isLoading } = useSWR("/api/transactions", fetcher, {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month"
            tick={{ fill: 'currentColor' }}  // Uses text color from your theme
          />
          <YAxis 
            tick={{ fill: 'currentColor' }}  // Uses text color from your theme
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}  // Subtle highlight on hover
          />
          <Bar 
            dataKey="totalExpenses" 
            fill="#8884d8"  // Changed from white to a visible color
            radius={[4, 4, 0, 0]}  // Rounded top corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}