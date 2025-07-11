import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧠 verifyAdmin middleware reached");
    console.log("Decoded Token:", decoded);

    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden: Not Admin" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
