import mongoose from "mongoose";
import Sale from "../models/saleModel.js";
import User from "../models/userModel.js";
export const payout = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const sales = await Sale.find({
      status: "pending",
      advancePaid: false,
    }).session(session);
    for (const sale of sales) {
      const advance = sale.earning * 0.1;
      const user = await User.findOne({
        userId: sale.userId,
      }).session(session);
      if (!user) {
        throw new Error(`User ${sale.userId} not found`);
      }
      user.withdrawableBalance += advance;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Advance payouts processed successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
