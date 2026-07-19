import express from "express";
import { payout } from "../controllers/payoutController.js";

const payoutRoute = express.Router();

payoutRoute.patch("/payouts/advance", payout);

export default payoutRoute;
