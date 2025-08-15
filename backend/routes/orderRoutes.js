import express from "express";
import { listOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Use your existing auth middleware

const orderRouter = express.Router();

// This route requires the user to be logged in
orderRouter.get("/list", authMiddleware, listOrders);

export default orderRouter;