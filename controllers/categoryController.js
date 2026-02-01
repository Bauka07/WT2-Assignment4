import Category from "../models/Category.js";
import validateObjectId from "../utils/validateObjectId.js";

export const createCategory = async (req, res, next) => {
  try {
    // Only admins can create categories
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admins can create categories",
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid category ID format",
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    // Only admins can update categories
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admins can update categories",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid category ID format",
      });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    // Only admins can delete categories
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admins can delete categories",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid category ID format",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
