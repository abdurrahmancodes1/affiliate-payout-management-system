import mongoose from "mongoose";
import Sale from "../models/saleModel.js";
import User from "../models/userModel.js";
export const createSale = async (req, res) => {
  try {
    const { userId, brand, earning } = req.body;
    if (!userId || !brand || earning == null) {
      return res.status(400).json({
        success: false,
        message: "Enter valid inputes",
      });
    }
    if (earning <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid input",
      });
    }
    const sale = await Sale.create({ userId, brand, earning });
    res.status(201).json({
      success: true,
      message: "Sale Created Successfully",
      data: sale,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSale = async (req, res) => {
  try {
    const sales = await Sale.find({});
    return res.status(200).json({
      success: true,
      message: "Sales fetched successfully",
      data: sales,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateStatus = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    const { saleId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please select an option",
      });
    }
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid option",
      });
    }

    await session.startTransaction();
    const sale = await Sale.findById(saleId).session(session);

    if (!sale) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({
        success: false,
        message: "NO sale found",
      });
    }
    if (sale.status !== "pending") {
      await session.abortTransaction();
      await session.endSession();

      return res.status(400).json({
        success: false,
        message: "Sale already reconciled",
      });
    }
    const { userId } = sale;
    const user = await User.findOne({ userId }).session(session);
    if (!user) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (status === "approved") {
      const remaining = sale.earning - sale.advanceAmount;
      user.withdrawableBalance += remaining;
    } else {
      user.withdrawableBalance -= sale.advanceAmount;
    }

    sale.status = status;
    await user.save({ session });
    await sale.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      message: `Sale ${status} successfully`,
      data: sale,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
