import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  // id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  month: { type: String, required: true }
}, { timestamps: true });


const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
// const Transaction=mongoose.model("Transaction", TransactionSchema);
export default Budget;