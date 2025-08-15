import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

// --- HELPER FUNCTION ---
// Creates a JWT token for a given user ID
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// =================================================================
// --- PUBLIC CONTROLLERS (No Authentication Required) ---
// =================================================================

// --- USER REGISTRATION ---
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    // 2. Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }
    // 3. Hash password and create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    // 4. Create a token and send it in the response
    const token = createToken(user._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Error during user registration" });
  }
};

// --- USER LOGIN ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }
    // 2. Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    // 4. Create a token and send it in the response
    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Error during login" });
  }
};

// --- ADMIN LOGIN ---
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
    const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ 
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during admin login" });
  }
};

// --- USER LOGOUT ---
const logoutUser = (req, res) => {
  res.status(200).json({ success: true, message: "Logout acknowledged" });
};

// =================================================================
// --- PROTECTED CONTROLLERS (Authentication Required) ---
// =================================================================

// --- GET USER'S CART DATA ---
const getCartData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, cartData: user.cartData || [] });
  } catch (error) {
    console.error("GetCart Error:", error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};

// --- UPDATE USER'S CART DATA (WITH DATA TRANSFORMATION) ---
const updateCart = async (req, res) => {
  try {
    const frontendCartObject = req.body.cartData;
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
    await userModel.findByIdAndUpdate(req.userId, { cartData: backendCartArray });
    res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("UpdateCart Error:", error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

// --- GET USER'S PROFILE DATA ---
const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("GetUserData Error:", error);
    res.status(500).json({ success: false, message: "Error fetching user data" });
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
