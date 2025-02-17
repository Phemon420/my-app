import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  // id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
// const Transaction=mongoose.model("Transaction", TransactionSchema);
export default Transaction;