import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Work", "Personal", "Ideas", "Study", "Todo", "Other"],
      default: "Other",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#ffffff",
      match: [/^#[0-9A-Fa-f]{6}$/, "Please enter a valid hex color code"],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
noteSchema.index({ title: "text", content: "text" });
noteSchema.index({ category: 1 });
noteSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model("Note", noteSchema);
