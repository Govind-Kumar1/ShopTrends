import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach decoded payload
    console.log("✅ adminAuth middleware passed:", decoded);
    next();
  } catch (error) {
    console.error("❌ Token error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;
 