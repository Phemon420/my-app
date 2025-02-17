import { NextResponse } from "next/server";
import { getTransactions, createTransaction } from "@/controllers/transactionController";

export async function GET() {
  return getTransactions();
}

export async function POST(req) {
  return createTransaction(req);
}
