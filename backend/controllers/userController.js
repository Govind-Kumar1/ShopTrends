import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

// 🔐 Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      cartData: [],
      orders: [],
    });

    const token = createToken(user._id);
    console.log(token);
    

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Registration successful",
        user: {
          name: user.name,
          email: user.email,
          cartData: user.cartData,
        },
      });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
console.log(user._id);

    const token = createToken(user._id);
    console.log(token);
    

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true, 
        sameSite: "None", 
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: { 
          name: user.name,
          email: user.email,
          cartData: user.cartData,
          token:token
        },
      });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Logout User
const logoutUser = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

// ✅ Get User Data (via cookie token)
const getUserData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized: No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      cartData: user.cartData || {},
      orders: user.orders || [],
      paymentHistory: user.paymentHistory || [],
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ UserData Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Cart
const updateCart = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cartData = req.body.cartData || {};
    await user.save();

    res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("❌ UpdateCart Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Cart
const getCartData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error("❌ GetCart Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Admin Login (no cookie)
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: { email, isAdmin: true },
    });
  } catch (error) {
    console.error("❌ AdminLogin Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  updateCart,
  getCartData,
  loginAdmin,
  getUserData, 
};
