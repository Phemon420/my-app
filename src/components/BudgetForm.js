"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES } from "@/models/Categories"

export default function BudgetForm({ onBudgetSet }) {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [month, setMonth] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!category || !amount || !month) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, amount: Number.parseFloat(amount), month }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Budget set successfully",
        })
        setCategory("")
        setAmount("")
        setMonth("")
        onBudgetSet()
      } else {
        throw new Error("Failed to set budget")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set budget",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <h1 className="text-3xl">Set Monthly Budget</h1>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="amount">Budget Amount</Label>
        <Input
          id="amount"
          type="number"
        //   step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter budget amount"
        />
      </div>
      <div>
        <Label htmlFor="month">Month</Label>
        <Input id="month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      <Button type="submit">Set Budget</Button>
    </form>
  )
}