import Tag from "../models/Tag.js";
import validateObjectId from "../utils/validateObjectId.js";

export const createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);

    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid tag ID format",
      });
    }

    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid tag ID format",
      });
    }

    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid tag ID format",
      });
    }

    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Tag deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
