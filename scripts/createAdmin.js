import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete existing admin if exists
    await User.deleteOne({ email: "bauka@gmail.com" });
    console.log("Cleared existing admin user");

    // Create new admin user (password will be hashed by pre-save hook)
    const admin = new User({
      email: "bauka@gmail.com",
      password: "baukagoi",
      role: "admin",
    });
    
    await admin.save();
    console.log("Created admin user: bauka@gmail.com");

    console.log("\nAdmin credentials:");
    console.log("  Email: bauka@gmail.com");
    console.log("  Password: baukagoi");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();
