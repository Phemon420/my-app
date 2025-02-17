import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/models/db";
import { validateTransaction } from "@/serializers/transactionSerializer";

export async function getTransactions() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find({});
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function createTransaction(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    console.log(data);
    // const { valid, errors } = await validateTransaction(data);
    // if (!valid) {
    //   return NextResponse.json({ success: false, errors });
    // }

    const newTransaction = new Transaction(data);
    await newTransaction.save();
    return NextResponse.json({ success: true, transaction: newTransaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}


export const deleteTransaction = async (req) => {
  await connectToDatabase(); // Ensure MongoDB connection

  // Extract transaction ID from the URL
  const _id = req.nextUrl.pathname.split("/").pop();
  console.log("Deleting transaction with ID:", _id);

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(_id);

    if (!deletedTransaction) {
      return new Response(JSON.stringify({ success: false, error: "Transaction not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Transaction deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};



export const updateTransaction = async (req) => {
  await connectToDatabase()

  const _id = req.nextUrl.pathname.split("/").pop()
  const { description, amount } = await req.json()

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      { description, amount },
      { new: true } // Return updated document
    )

    if (!updatedTransaction) {
      return new Response(JSON.stringify({ success: false, error: "Transaction not found" }), { status: 404 })
    }

    return new Response(JSON.stringify({ success: true, transaction: updatedTransaction }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 })
  }
}
