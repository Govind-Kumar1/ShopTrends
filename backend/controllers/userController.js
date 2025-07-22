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

    if (await userModel.findOne({ email })) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
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

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
    console.log("Error while registering user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
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
        },
      });
  } catch (error) {
    console.log("Error while logging in user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ✅ Get User Data (auth check)
const getUserData = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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
    console.error("❌ Error while fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
    console.log("Error updating cart:", error);
    res.status(500).json({ success: false, message: error.message });
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
    console.log("Error fetching cart data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ⚠️ Admin Login — still uses token in response
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        email,
        isAdmin: true,
      },
    });
  } catch (error) {
    console.log("Error while logging in admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
