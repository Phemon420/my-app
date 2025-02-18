"use client"

import { useState,useEffect } from "react"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import ExpensesChart from "@/components/ExpensesChart"
import CategoryPieChart from "@/components/CategoryPieChart"
import BudgetForm from "@/components/BudgetForm"
import Dashboard from "@/components/Dashboard"
import BudgetComparisonChart from "@/components/BudgetComparisonChart"
import { mutate } from 'swr'

export default function Home() {
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const handleTransactionChange = () => {
    // Increment trigger to cause revalidation
    setUpdateTrigger((prev) => prev + 1)
  }

  // Use useEffect to trigger revalidation whenever updateTrigger changes
  useEffect(() => {
    // Revalidate all components using SWR
    mutate('/api/transactions')
    mutate('/api/transactions/category')
    mutate('/api/budgets/')
  }, [updateTrigger]) // Dependency on updateTrigger

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Transaction Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Dashboard />
          <TransactionForm onTransactionAdded={handleTransactionChange} />
          <TransactionList key={updateTrigger} onTransactionDeleted={handleTransactionChange} />
        </div>
        <div className="space-y-6">
          <BudgetForm onBudgetSet={handleTransactionChange} />
          <ExpensesChart />
          <CategoryPieChart />
        </div>
      </div>
      <BudgetComparisonChart />
    </main>
  )
}