import { deleteTransaction } from "@/controllers/transactionController";
import { updateTransaction } from "@/controllers/transactionController"


// Export DELETE handler as a named export
export async function DELETE(req, res) {
  return deleteTransaction(req);
}

export async function PATCH(req) {
  return updateTransaction(req)
}
