// import { getBudgetComparison } from "@/controllers/budgetController"

// export async function GET(request) {
//     console.log(request)
//   const { searchParams } = new URL(request.url)
//   const month = searchParams.get("month")

//   if (!month) {
//     return new Response(JSON.stringify({ error: "Month parameter is required" }), { status: 400 })
//   }

//   const comparison = await getBudgetComparison(month)
//   return new Response(JSON.stringify(comparison), { status: 200 })
// }