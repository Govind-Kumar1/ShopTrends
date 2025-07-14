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
    console.error("❌Error while adding product:", error);
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
// ✅ Helper: Extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileWithExt = parts[parts.length - 1];
  const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf(".")); // remove .jpg or .png
  return `${parts[parts.length - 2]}/${publicId}`; // folder/filename
};

// ✅ Remove Product Controller
 const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 🧹 Delete Cloudinary images
    const deletePromises = product.image.map(async (imgUrl) => {
      const publicId = extractPublicId(imgUrl);
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises); // Wait for all deletes

    // 🗑️ Delete from DB
    await productModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "✅ Product deleted from DB & Cloudinary" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: "Server error during delete" });
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
