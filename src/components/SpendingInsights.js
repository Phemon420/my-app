"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SpendingInsights({ month }) {
  const [insights, setInsights] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchInsights()
  }, []) // Removed unnecessary dependency: month

  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/insights?month=${month}`)
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      } else {
        throw new Error("Failed to fetch insights")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch spending insights",
        variant: "destructive",
      })
    }
  }

  if (!insights) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Budget: ${insights.totalBudget.toFixed(2)}</p>
          <p>Total Spent: ${insights.totalSpent.toFixed(2)}</p>
          <p>Overall: {insights.totalSpent > insights.totalBudget ? "Over budget" : "Under budget"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories Over Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {insights.overBudgetCategories.map((category) => (
              <li key={category.category}>
                {category.category}: ${category.overAmount.toFixed(2)} over budget
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories Under Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {insights.underBudgetCategories.map((category) => (
              <li key={category.category}>
                {category.category}: ${category.underAmount.toFixed(2)} under budget
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

