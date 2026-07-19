import mongoose from "mongoose";
import User from "../models/userModel.js";
import Withdraw from "../models/withdrawalModel.js";

export const withdraw = async (req, res) => {
  let session;

  try {
    const { userId, amount } = req.body;

    // Validate input
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid userId and amount are required",
      });
    }

    // Find user
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check balance
    if (amount > user.withdrawableBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Check 24-hour rule
    const now = new Date();

    if (
      user.lastWithdrawalAt &&
      now - user.lastWithdrawalAt < 24 * 60 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "You can withdraw only once every 24 hours",
      });
    }

    // Start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Deduct balance
    user.withdrawableBalance -= amount;
    user.lastWithdrawalAt = now;

    await user.save({ session });

    // Create withdrawal
    const [withdrawal] = await Withdraw.create(
      [
        {
          userId,
          amount,
          status: "pending",
        },
      ],
      { session },
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Withdrawal request created successfully",
      data: withdrawal,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const updateWithdrawalStatus = async (req, res) => {
  let session;

  try {
    const { withdrawalId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!["success", "failed", "cancelled", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const withdrawal = await Withdraw.findById(withdrawalId).session(session);

    if (!withdrawal) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    if (withdrawal.status !== "pending") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Withdrawal already processed",
      });
    }

    // Refund if payout failed
    if (["failed", "cancelled", "rejected"].includes(status)) {
      const user = await User.findOne({
        userId: withdrawal.userId,
      }).session(session);

      if (!user) {
        await session.abortTransaction();
        session.endSession();

        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.withdrawableBalance += withdrawal.amount;
      await user.save({ session });
    }

    withdrawal.status = status;
    await withdrawal.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: `Withdrawal marked as ${status}`,
      data: withdrawal,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
