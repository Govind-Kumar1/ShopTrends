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

productRouter.post(
  "/add",
  (req, res, next) => {
    console.log("✅ Route hit: /add");
    next();
  },
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  verifyAdmin, // ✅ this should run after token is decoded
  addProduct
);

productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", getSingleProduct);
productRouter.get("/list", listProducts);

export default productRouter;
