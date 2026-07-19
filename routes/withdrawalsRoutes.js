import express from "express";
import { withdraw } from "../controllers/withdrawalController.js";
export const withdrawalRoutes = express.Router();

withdrawalRoutes.post("/withdrawals", withdraw);
withdrawalRoutes.patch("/withdrawals/:withdrawalId/status");
