import { NextResponse } from "next/server";
import { getBudgets,createBudget } from "@/controllers/budgetController";

export async function GET() {
  return getBudgets();
}

export async function POST(req) {
  //console.log(req);
  return createBudget(req);
}
