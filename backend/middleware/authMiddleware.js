import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; // 👈 token from cookie

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token in cookie" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
 
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};
 
export default authMiddleware;
  