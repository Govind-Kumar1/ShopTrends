import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentId: String, // Razorpay / Stripe ID
  orderDate: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    required: true,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: [cartItemSchema],
    default: [],
  },
  orders: {
    type: [orderSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
