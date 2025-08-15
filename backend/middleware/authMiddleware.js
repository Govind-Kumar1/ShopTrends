// File: src/middleware/authMiddleware.js (Final Corrected Code)

import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const token = authorization.split(" ")[1];

    // ✅ FIX: jwt.verify returns the payload directly.
    // The payload is the object we signed: { id: user._id }
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // We get the id from the decoded payload.
    req.userId = decodedPayload.id;

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(401).json({ success: false, message: "Authorization failed, invalid token" });
  }
};

export default authMiddleware;
