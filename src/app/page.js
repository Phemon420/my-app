"use client"

import { useState } from "react"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import ExpensesChart from "@/components/ExpensesChart"

export default function Home() {
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const handleTransactionChange = () => {
    setUpdateTrigger((prev) => prev + 1)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Transaction Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TransactionForm onTransactionAdded={handleTransactionChange} />
          <TransactionList key={updateTrigger} onTransactionDeleted={handleTransactionChange} />
        </div>
        <div>
          <ExpensesChart key={updateTrigger} />
        </div>
      </div>
    </main>
  )
}