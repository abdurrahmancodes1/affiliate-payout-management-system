import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
    },
    status: {
      enum: ["Pending", "Success", "Failed", "Cancelled", "Rejected"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Withdraw", withdrawalSchema);
