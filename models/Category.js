import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    color: {
      type: String,
      default: "#3b82f6",
      match: [/^#[0-9A-Fa-f]{6}$/, "Please enter a valid hex color code"],
    },
    icon: {
      type: String,
      default: "📂",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
