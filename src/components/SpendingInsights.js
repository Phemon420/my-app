// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export default function SpendingInsights({ budgetData, expenseData }) {
//   if (!budgetData || !expenseData) return null
//   console.log(budgetData)
//   console.log(expenseData)
//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Spending Insights</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Total Budget: ${budgetData.totalBudget.toFixed(2)}</p>
//           <p>Total Spent: ${expenseData.totalSpent.toFixed(2)}</p>
//           <p>
//             Overall:{" "}
//             {expenseData.totalSpent > budgetData.totalBudget ? "Over budget" : "Under budget"}
//           </p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Categories Over Budget</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul>
//             {expenseData.overBudgetCategories.map((category) => (
//               <li key={category.category}>
//                 {category.category}: ${category.overAmount.toFixed(2)} over budget
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Categories Under Budget</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul>
//             {budgetData.underBudgetCategories.map((category) => (
//               <li key={category.category}>
//                 {category.category}: ${category.underAmount.toFixed(2)} under budget
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }






"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function compareBudgetAndExpenses(budgetData, expenseData) {
  let totalBudget = 0, totalSpent = 0
  let overBudgetCategories = []
  let underBudgetCategories = []

  for (const category in budgetData) {
    const budgetAmount = budgetData[category].budgetAmount || 0
    const actualAmount = expenseData[category]?.actualAmount || 0
    totalBudget += budgetAmount
    totalSpent += actualAmount

    if (actualAmount > budgetAmount) {
      overBudgetCategories.push({ category, overAmount: actualAmount - budgetAmount })
    } else if (actualAmount < budgetAmount) {
      underBudgetCategories.push({ category, underAmount: budgetAmount - actualAmount })
    }
  }

  return { totalBudget, totalSpent, overBudgetCategories, underBudgetCategories }
}

export default function SpendingInsights({ budgetData, expenseData }) {
  if (!budgetData || !expenseData) return null

  const { totalBudget, totalSpent, overBudgetCategories, underBudgetCategories } = compareBudgetAndExpenses(budgetData, expenseData)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Budget: ${totalBudget.toFixed(2)}</p>
          <p>Total Spent: ${totalSpent.toFixed(2)}</p>
          <p>
            Overall: {totalSpent > totalBudget ? "Over budget" : "Under budget"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories Over Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {overBudgetCategories.length > 0 ? (
              overBudgetCategories.map(({ category, overAmount }) => (
                <li key={category}>{category}: ${overAmount.toFixed(2)} over budget</li>
              ))
            ) : (
              <p>No categories are over budget.</p>
            )}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories Under Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {underBudgetCategories.length > 0 ? (
              underBudgetCategories.map(({ category, underAmount }) => (
                <li key={category}>{category}: ${underAmount.toFixed(2)} under budget</li>
              ))
            ) : (
              <p>No categories are under budget.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}