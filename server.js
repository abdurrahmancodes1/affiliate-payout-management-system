import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { salesRoute } from "./routes/salesRoutes.js";
import payoutRoute from "./routes/payoutRoute.js";
import { withdrawalRoutes } from "./routes/withdrawalsRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Payout Management System API",
  });
});
app.use("/api", salesRoute);
app.use("/api", payoutRoute);
app.use("/api", withdrawalRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
