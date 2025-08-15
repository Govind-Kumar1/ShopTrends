import express from "express";
import {
  loginUser,
  registerUser,
  loginAdmin,
  updateCart, // We will use this one for syncing
  getCartData,
  getUserData,
  logoutUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// --- Public Routes ---
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", loginAdmin);
userRouter.post("/logout", logoutUser);

// --- Protected Routes (Login Required) ---
userRouter.get("/get-cart", authMiddleware, getCartData);
userRouter.get("/userData", authMiddleware, getUserData);

// ✅ FIX: This must be a POST route to receive data from the middleware
userRouter.post("/update-cart", authMiddleware, updateCart);

export default userRouter;