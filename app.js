import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";

import errorHandler from "./middleware/errorHandler.js";

import noteRoutes from "./routes/noteRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "*", // для задания норм, потом можно ограничить
    credentials: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tags", tagRoutes);

// Root route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Notes API",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth (POST /register, POST /login)",
      categories: "/api/categories",
      notes: "/api/notes",
      tags: "/api/tags",
    },
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
