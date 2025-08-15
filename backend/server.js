import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import orderRouter from './routes/orderRoutes.js'; // ✅ Import
const app = express();
const port = process.env.PORT || 5000;
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ to read cookies from request

const allowedOrigins = [ 
  "http://localhost:5173", 
  "http://localhost:5174", 
  "https://shop-trends-zynz.vercel.app",
  "https://shop-frontend-gules.vercel.app",
  
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
app.use("/api/order", orderRouter);

// ✅ Start server
app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
  