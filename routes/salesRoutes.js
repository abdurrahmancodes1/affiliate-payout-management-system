import express from "express";
import {
  createSale,
  getSale,
  updateStatus,
} from "../controllers/salesController.js";
export const salesRoute = express.Router();

salesRoute.get("/sales", getSale);

salesRoute.post("/sales", createSale);
salesRoute.patch("/sales/:saleId/status", updateStatus);
