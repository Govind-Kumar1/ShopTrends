import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import streamifier from "streamifier";

//----------- Helper Function to Upload to Cloudinary -----------//
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

//----------- 1. Add Product Controller -----------//
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

    if (uploadedImages.length === 0) {
        return res.status(400).json({ success: false, message: "At least one image is required." });
    }

    const imageUrls = await Promise.all(
      uploadedImages.map((image) => uploadToCloudinary(image.buffer))
    );

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

//----------- 2. List All Products Controller -----------//
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error while fetching all products: ", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//----------- 3. Get Single Product Controller (FIXED) -----------//
const getSingleProduct = async (req, res) => {
  try {
    // Get ID from URL parameter, not body
    const productId = req.params.id;

    // Check if the ID format is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID format." });
    }

    const product = await productModel.findById(productId);

    // ✅ Crucial Check: If product is not found, send 404
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // If product is found, send success response
    res.status(200).json({ success: true, product });

  } catch (error) {
    console.log("Error while fetching single product: ", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


//----------- Helper Function to get Public ID from URL -----------//
const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileWithExt = parts.pop(); // e.g., 'image.jpg'
  const folder = parts.pop(); // e.g., 'products'
  const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf("."));
  return `${folder}/${publicId}`;
};

//----------- 4. Remove Product Controller -----------//
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.image && product.image.length > 0) {
        const deletePromises = product.image.map(async (imgUrl) => {
            const publicId = extractPublicId(imgUrl);
            return cloudinary.uploader.destroy(publicId);
        });
        await Promise.all(deletePromises);
    }

    // Delete from DB
    await productModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: "Server error during delete" });
  } 
};


export { addProduct, listProducts, removeProduct, getSingleProduct };