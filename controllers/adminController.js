import User from "../models/User.js";
import Note from "../models/Note.js";
import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import validateObjectId from "../utils/validateObjectId.js";

// ===== USER MANAGEMENT =====

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const { email, role } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (role && ["user", "admin"].includes(role)) updateData.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: "Cannot delete yourself" });
    }

    // Delete all notes by this user
    await Note.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// ===== NOTES MANAGEMENT (ALL USERS' NOTES) =====

export const getAllNotesAdmin = async (req, res, next) => {
  try {
    const notes = await Note.find()
      .populate("tags", "name color")
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNoteAdmin = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid note ID" });
    }

    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// ===== CATEGORY MANAGEMENT =====

export const createCategoryAdmin = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryAdmin = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid category ID" });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryAdmin = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid category ID" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// ===== TAG MANAGEMENT =====

export const createTagAdmin = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const tag = await Tag.create({
      name: name.toLowerCase().trim(),
      color: color || "#6366f1",
    });
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const updateTagAdmin = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid tag ID" });
    }

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name.toLowerCase().trim();
    if (req.body.color) updateData.color = req.body.color;

    const tag = await Tag.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(404).json({ success: false, error: "Tag not found" });
    }
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const deleteTagAdmin = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid tag ID" });
    }

    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, error: "Tag not found" });
    }

    // Remove tag from all notes
    await Note.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// ===== DASHBOARD STATS =====

export const getDashboardStats = async (req, res, next) => {
  try {
    const [usersCount, notesCount, categoriesCount, tagsCount] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments(),
      Category.countDocuments(),
      Tag.countDocuments(),
    ]);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentNotes = await Note.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: usersCount,
          notes: notesCount,
          categories: categoriesCount,
          tags: tagsCount,
        },
        recentUsers,
        recentNotes,
      },
    });
  } catch (error) {
    next(error);
  }
};
