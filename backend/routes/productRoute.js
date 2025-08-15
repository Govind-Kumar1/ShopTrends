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
  adminAuth,
  verifyAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// ✅ Remove Product (admin only)
productRouter.post("/remove", adminAuth, verifyAdmin, removeProduct);

// ✅ Get all products
productRouter.get("/list", listProducts);

// ✅ Get single product by ID (Standard RESTful way)
// Example URL: /api/product/60d21b4667d0d8992e610c85
productRouter.get("/:id", getSingleProduct);


// ❌ The old non-standard route has been removed. 
// productRouter.post("/single", getSingleProduct);

export default productRouter;