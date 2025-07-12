import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import streamifier from "streamifier";

// ✅ Route to add a new product (admin only)
// Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    // Required field check
    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Image upload from memory buffer
    const uploadedImages = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files[key]?.[0])
      .filter(Boolean);

    let imageUrls = [];

    if (uploadedImages.length > 0) {
      imageUrls = await Promise.all(
        uploadedImages.map((image) => uploadToCloudinary(image.buffer))
      );
    }

    // Create product
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
      bestSeller: bestSeller === "true" || bestSeller === true,
      image: imageUrls,
      date: Date.now(),
    };

    const product = await productModel.create(productData);

    res.status(201).json({
      success: true,
      message: "✅ Product added successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error while adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

 
const listProducts = async (req, res) => { 
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error while fetching all products: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log("Error while removing product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching a single product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error while fetching single product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, getSingleProduct };
