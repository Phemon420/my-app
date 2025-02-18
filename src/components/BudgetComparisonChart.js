"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useToast } from "@/hooks/use-toast"
import useSWR from 'swr'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIES } from "@/models/Categories"
import SpendingInsights from "@/components/SpendingInsights"

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-foreground">
            {entry.name}: ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const processTransactionData = (rawData,selectedMonth) => {
  // Initialize an object with all categories set to 0
  const initialData = CATEGORIES.reduce((acc, category) => {
    acc[category] = { actualAmount: 0 }
    return acc
  }, {})
  
  // If no data, return the initialized object
  if (!rawData) return initialData
  
  // Handle different possible data structures
  const transactions = Array.isArray(rawData) 
    ? rawData 
    : rawData.transactions || rawData.data || []

  // If transactions is not an array, return initialized data
  if (!Array.isArray(transactions)) {
    console.error('Invalid transactions data structure:', transactions)
    return initialData
  }

  // Process the transactions, starting with the initialized data
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;
    //const transactionMonth = parseInt(transaction.month.split('-')[1])
    //console.log(transactionMonth,transactionYear)
    if (CATEGORIES.includes(category) && transactionMonth == selectedMonth && transactionYear === new Date().getFullYear()) {
      acc[category].actualAmount += Number(transaction.amount) || 0
    }
    return acc
  }, initialData)
}


const processTargetData = (rawData, selectedMonth) => {
  // Initialize an object with all categories set to 0
  // console.log(rawData)
  // console.log("selected Month: ", selectedMonth)
  const initialData = CATEGORIES.reduce((acc, category) => {
    acc[category] = { budgetAmount: 0 }
    return acc
  }, {})
  
  // If no data, return the initialized object
  if (!rawData) return initialData
  
  // Handle different possible data structures
  const budgets = Array.isArray(rawData) 
    ? rawData 
    : rawData.budgets || rawData.data || []

  // If budgets is not an array, return initialized data
  if (!Array.isArray(budgets)) {
    console.error('Invalid budget data structure:', budgets)
    return initialData
  }

  // Process the budgets, adding amounts only if the month matches selectedMonth
  return budgets.reduce((acc, budget) => {
    const category = budget.category
    // Extract month from the date string (e.g., "2025-06" → 6)
    const budgetMonth = parseInt(budget.month.split('-')[1])
    //console.log(budgetMonth)
    
    if (CATEGORIES.includes(category) && budgetMonth === selectedMonth) {
      acc[category].budgetAmount += Number(budget.amount) || 0
    }
    return acc
  }, initialData)
}


const fetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch chart data')
  }
  return response.json()
}

export default function BudgetComparisonChart() {
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  
  const { data: transdata, error: error1, isLoading: isLoading1 } = useSWR(
    `/api/transactions`,
    fetcher,
    {
      fallbackData: { transactions: [] },
      revalidateOnMount: true
    }
  )

  const { data: budgetData, error, isLoading } = useSWR(
    `/api/budgets`,
    fetcher,
    {
      fallbackData: { budgets: [] },
      revalidateOnMount: true
    }
  )

  if (isLoading || isLoading1) return <p>Loading chart...</p>
  if (error || error1) {
    toast({ title: "Error", description: "Failed to fetch chart data", variant: "destructive" })
    return <p className="text-red-500">Error loading chart</p>
  }

  // Process the data
  const transactions = processTransactionData(transdata,selectedMonth)
  console.log(typeof transactions)
  const budgets = processTargetData(budgetData,selectedMonth)
  //console.log(budgets)

  // Create chart data with all categories
  const chartData = CATEGORIES.map(category => ({
    category,
    actualAmount: transactions[category]?.actualAmount || 0,
    budgetAmount: budgets[category]?.budgetAmount || 0
  }))

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle>Budget vs Actual Comparison</CardTitle>
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="budgetAmount" 
              fill="#8884d8" 
              name="Budget"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="actualAmount" 
              fill="#82ca9d" 
              name="Actual"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <SpendingInsights budgetData={budgets} expenseData={transactions} />
    </Card>
  )
}