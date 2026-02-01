import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.log("Usage: node scripts/makeAdmin.js <email>");
    console.log("Example: node scripts/makeAdmin.js admin@example.com");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email "${email}" not found`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`User "${email}" is already an admin`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`Successfully made "${email}" an admin!`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

makeAdmin();
