import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App.jsx";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestSeller: false,
  });

  const [images, setImages] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, sizes }));
  };

  const handleImageChange = (e) => {
    // Only take the first file (since backend expects 1 file per field)
    setImages((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key === "sizes") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    // Append image files (only 1 per field)
    ["image1", "image2", "image3", "image4"].forEach((key) => {
      if (images[key]) {
        data.append(key, images[key]);
      }
    });

    try {
      const res = await axios.post(
        `${backendUrl}/api/product/addItem`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("✅ Product added successfully!");
      console.log("Server Response:", res.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("❌ Failed to add product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Fields */}
        {["name", "description", "price", "category", "subCategory"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        ))}

        {/* Sizes Input */}
        <input
          type="text"
          name="sizes"
          placeholder='Sizes (e.g. "S, M, L")'
          onChange={handleSizesChange}
          className="w-full p-2 border rounded"
        />

        {/* Best Seller Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="bestSeller"
            checked={formData.bestSeller}
            onChange={handleInputChange}
          />
          Best Seller
        </label>

        {/* Image Uploads (single image per field) */}
        {["image1", "image2", "image3", "image4"].map((imgKey) => (
          <div key={imgKey}>
            <label className="block mb-1 font-medium">{imgKey}</label>
            <input
              type="file"
              name={imgKey}
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required={imgKey === "image1"} // image1 required, rest optional
            />
          </div>
        ))}

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
