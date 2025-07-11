import express from "express";
import {
  loginUser,
  registerUser,
  loginAdmin,
  updateCart,
  getCartData,
  getUserData,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Import it

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", loginAdmin);

// ✅ Protected Routes
userRouter.post("/update-cart", authMiddleware, updateCart);
userRouter.get("/get-cart", authMiddleware, getCartData);
userRouter.get("/userData", authMiddleware, getUserData);

export default userRouter;
