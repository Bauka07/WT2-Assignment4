import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../models/Category.js";

dotenv.config();

const defaultCategories = [
  {
    name: "Work",
    description: "Work-related notes and tasks",
    color: "#3b82f6",
    icon: "💼",
  },
  {
    name: "Personal",
    description: "Personal notes and reminders",
    color: "#8b5cf6",
    icon: "👤",
  },
  {
    name: "Ideas",
    description: "Creative ideas and brainstorming",
    color: "#f59e0b",
    icon: "💡",
  },
  {
    name: "Study",
    description: "Study notes and learning materials",
    color: "#10b981",
    icon: "📚",
  },
  {
    name: "Todo",
    description: "Todo lists and tasks",
    color: "#ef4444",
    icon: "✅",
  },
  {
    name: "Other",
    description: "Miscellaneous notes",
    color: "#6b7280",
    icon: "📁",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Insert default categories
    const categories = await Category.insertMany(defaultCategories);
    console.log(`Seeded ${categories.length} categories:`);
    categories.forEach((cat) => {
      console.log(`  - ${cat.icon} ${cat.name}`);
    });

    console.log("\nCategories seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
