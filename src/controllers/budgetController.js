import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Budget from "@/models/monthlybudget";

export async function getBudgets() {
  try {
    await connectToDatabase();
    const budgets = await Budget.find({});
    return NextResponse.json({ success: true, budgets });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function createBudget(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    console.log("Received Data:", data);

    const { category, month } = data;

    // Check if a budget entry for the same category and month exists
    const existingBudget = await Budget.findOne({ category, month });

    if (existingBudget) {
      await Budget.deleteOne({ _id: existingBudget._id }); // Delete the existing budget
    }

    // Create and save the new budget entry
    const newBudget = new Budget(data);
    await newBudget.save();

    return NextResponse.json({ success: true, budget: newBudget });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function getBudgetComparison(month) {
  try {
    const budgets = await Budget.find({ month });
    
    if (!budgets.length) {
      return { error: "No budget data found for the given month" };
    }
    
    // Example: Summarizing budget amounts by category
    const summary = budgets.reduce((acc, budget) => {
      acc[budget.category] = (acc[budget.category] || 0) + budget.amount;
      return acc;
    }, {});
    
    return { month, summary };
  } catch (error) {
    return { error: "Failed to fetch budget data" };
  }
}


// export const deleteTransaction = async (req) => {
//   await connectToDatabase(); // Ensure MongoDB connection

//   // Extract transaction ID from the URL
//   const _id = req.nextUrl.pathname.split("/").pop();
//   console.log("Deleting transaction with ID:", _id);

//   try {
//     const deletedTransaction = await Transaction.findByIdAndDelete(_id);

//     if (!deletedTransaction) {
//       return new Response(JSON.stringify({ success: false, error: "Transaction not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response(JSON.stringify({ success: true, message: "Transaction deleted successfully" }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ success: false, error: "Server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// };



// export const updateTransaction = async (req) => {
//   await connectToDatabase()

//   const _id = req.nextUrl.pathname.split("/").pop()
//   const { description, amount, category } = await req.json()

//   try {
//     const updatedTransaction = await Transaction.findByIdAndUpdate(
//       _id,
//       { description, amount, category },
//       { new: true } // Return updated document
//     )

//     if (!updatedTransaction) {
//       return new Response(JSON.stringify({ success: false, error: "Transaction not found" }), { status: 404 })
//     }

//     return new Response(JSON.stringify({ success: true, transaction: updatedTransaction }), { status: 200 })
//   } catch (error) {
//     return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 })
//   }
// }