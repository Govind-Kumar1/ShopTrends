import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

 
 
// 🔐 Generate JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// INFO: Controller to get user details like cart, orders, etc.
const getUserData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      cartData: user.cartData || {},
      orders: user.orders || [],
      paymentHistory: user.paymentHistory || [],
    });
  } catch (error) {
    console.error("❌ Error while fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Register User
 const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (await userModel.findOne({ email })) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with empty cart and orders
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      cartData: [],     // ✅ FIX: empty array, not object
      orders: [],       // optional but clean initialization
    });

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        cartData: user.cartData,
        orders: user.orders,
      }
    });
  } catch (error) {
    console.log("Error while registering user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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

 
// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        cartData: user.cartData,
      }
    });
  } catch (error) {
    console.log("Error while logging in user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update User Cart (after user adds/removes items)
const updateCart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
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

// ✅ Get User Cart (on login, frontend loads this)
const getCartData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
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

export {
  registerUser,
  loginUser,
  updateCart,
  getCartData,
  loginAdmin, 
  getUserData,
};
