"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import useSWR from 'swr'

const processTransactions = (transactions) => {
  // Calculate total expenses
  const totalExpenses = transactions.reduce((total, t) => total + Math.abs(t.amount), 0)

  // Calculate category breakdown
  const categoryBreakdown = transactions.reduce((acc, t) => {
    const category = t.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + Math.abs(t.amount)
    return acc
  }, {})

  // Convert category breakdown to array format
  const categoryData = Object.entries(categoryBreakdown).map(([category, totalExpenses]) => ({
    category,
    totalExpenses
  })).sort((a, b) => b.totalExpenses - a.totalExpenses)

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    // .sort((a, b) => new Date(b.date) - new Date(a.date))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  return {
    totalExpenses,
    categoryBreakdown: categoryData,
    recentTransactions
  }
}


const fetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data')
  }
  return response.json()
}

export default function Dashboard() {

  const { data, error, isLoading } = useSWR("/api/transactions/category", fetcher, {
    fallbackData: [],
    revalidateOnMount: true
  })

  const { toast } = useToast()
  
  if (error) {
    toast({ title: "Error", description: "Failed to fetch chart data", variant: "destructive" })
    return <p className="text-red-500">Error loading chart</p>
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="animate-pulse bg-gray-200 h-6 w-32 rounded" />
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 w-full rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const rawData = Array.isArray(data) ? data : data?.transactions || []
  const { totalExpenses, categoryBreakdown, recentTransactions } = processTransactions(rawData)
  console.log(rawData);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {categoryBreakdown.map((category) => (
              <li key={category.category} className="flex justify-between items-center">
                <span className="font-medium">{category.category}</span>
                <span className="text-muted-foreground">
                  ${category.totalExpenses.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="flex justify-between items-center">
                <span className="font-medium">{transaction.description}</span>
                <span className="text-muted-foreground">
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}