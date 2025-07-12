import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const productRouter = express.Router();

// ✅ Add Product Route (admin only)
productRouter.post(
  "/addItem",
  adminAuth, // 🔐 Decode token & attach to req.user
  verifyAdmin, // 🔍 Check admin privileges
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("✅ Route hit: /api/product/addItem");
    next();
  },
  addProduct
);

// ✅ Remove Product (admin only)
productRouter.post("/remove", adminAuth, verifyAdmin, removeProduct);

// ✅ Get single product by ID
productRouter.post("/single", getSingleProduct);

// ✅ Get all products
productRouter.get("/list", listProducts);

export default productRouter;
