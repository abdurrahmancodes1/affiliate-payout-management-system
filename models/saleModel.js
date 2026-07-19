import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      enum: ["brand_1", "brand_2", "brand_3"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    earning: {
      type: Number,
      required: true,
    },

    advancePaid: {
      type: Boolean,
      default: false,
    },

    advanceAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Sale", saleSchema);
