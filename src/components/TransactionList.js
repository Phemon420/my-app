"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { CATEGORIES } from "@/models/Categories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  console.log(data)
  return data
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function TransactionList({ onTransactionDeleted }) {
  const { data, error, isLoading, mutate } = useSWR("/api/transactions", fetcher, {
    fallbackData: [],
    revalidateOnMount: true
  })

  const { toast } = useToast()
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState({ description: "", amount: "", category: "" })

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
        <p>Loading transactions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
        <p className="text-red-500">Error loading transactions</p>
      </div>
    )
  }

  const transactions = Array.isArray(data) ? data : data?.transactions || []

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({ title: "Success", description: "Transaction deleted successfully" })
        mutate()
        onTransactionDeleted?.()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete transaction")
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id)
    setEditValue({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category || ""
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditValue((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value) => {
    setEditValue((prev) => ({ ...prev, category: value }))
  }

  const handleEditSubmit = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValue),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Transaction updated successfully" })
        mutate()
        setEditingId(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update transaction")
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="flex justify-between items-center border-b pb-2">
              <div>
                {editingId === transaction._id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="description"
                      value={editValue.description}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                    <input
                      type="number"
                      name="amount"
                      value={editValue.amount}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-24"
                    />
                    <Select 
                      value={editValue.category} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => handleEditSubmit(transaction._id)}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={transaction.amount < 0 ? "text-red-500" : "text-green-500"}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
                {editingId === transaction._id ? (
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="text-blue-500 bg-white" onClick={() => handleEditClick(transaction)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction._id)}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}