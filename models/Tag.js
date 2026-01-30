import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [30, "Tag name cannot exceed 30 characters"],
    },
    color: {
      type: String,
      default: "#3b82f6",
      match: [/^#[0-9A-Fa-f]{6}$/, "Please enter a valid hex color code"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Tag", tagSchema);
