import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    withdrawableBalance: {
      type: Number,
      default: 0,
    },

    lastWithdrawalAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
