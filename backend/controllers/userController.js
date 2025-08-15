import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

// --- HELPER FUNCTION ---
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// --- USER LOGIN, REGISTRATION, etc. (No changes here) ---
const registerUser = async (req, res) => { /* ... same as before ... */ };
const loginUser = async (req, res) => { /* ... same as before ... */ };
const loginAdmin = async (req, res) => { /* ... same as before ... */ };
const logoutUser = (req, res) => { /* ... same as before ... */ };
const getUserData = async (req, res) => { /* ... same as before ... */ };

// --- GET USER'S CART DATA ---
const getCartData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error("GetCart Error:", error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};

// --- ✅ UPDATE USER'S CART DATA (WITH DATA TRANSFORMATION) ---
const updateCart = async (req, res) => {
  try {
    const frontendCartObject = req.body.cartData;

    // 1. Transform the frontend's object into the backend's required array format
    const backendCartArray = [];
    for (const productId in frontendCartObject) {
      for (const size in frontendCartObject[productId]) {
        backendCartArray.push({
          productId,
          size,
          quantity: frontendCartObject[productId][size],
        });
      }
    }

    // 2. Save the correctly formatted array to the database
    await userModel.findByIdAndUpdate(req.userId, { cartData: backendCartArray });

    res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("UpdateCart Error:", error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

export {
  registerUser,
  loginUser,
  getCartData,
  updateCart,
  getUserData,
  loginAdmin,
  logoutUser,
};