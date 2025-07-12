import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();

// ✅ Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://shop-trends-zynz.vercel.app/",
  "http://localhost:5174",
  "https://shoptrends.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// ✅ Start server
app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
