import Note from "../models/Note.js";
import Tag from "../models/Tag.js";
import validateObjectId from "../utils/validateObjectId.js";

export const createNote = async (req, res, next) => {
  try {
    const noteData = { ...req.body };

    // Convert tag names to tag IDs
    if (req.body.tags && req.body.tags.length > 0) {
      const tagIds = await convertTagNamesToIds(req.body.tags);
      noteData.tags = tagIds;
    }

    const note = await Note.create(noteData);
    const populatedNote = await Note.findById(note._id).populate(
      "tags",
      "name color",
    );

    res.status(201).json({
      success: true,
      data: populatedNote,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const { category, isPinned, search, tag } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isPinned !== undefined) {
      query.isPinned = isPinned === "true";
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tag name
    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag.toLowerCase() });
      if (tagDoc) {
        query.tags = tagDoc._id;
      } else {
        // If tag doesn't exist, return empty array
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
    }

    const notes = await Note.find(query)
      .populate("tags", "name color")
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findById(req.params.id).populate(
      "tags",
      "name color",
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const noteData = { ...req.body };

    // Convert tag names to tag IDs
    if (req.body.tags && req.body.tags.length > 0) {
      const tagIds = await convertTagNamesToIds(req.body.tags);
      noteData.tags = tagIds;
    } else if (req.body.tags && req.body.tags.length === 0) {
      // Handle empty tags array
      noteData.tags = [];
    }

    const note = await Note.findByIdAndUpdate(req.params.id, noteData, {
      new: true,
      runValidators: true,
    }).populate("tags", "name color");

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to convert tag names to tag IDs
async function convertTagNamesToIds(tagNames) {
  const tagIds = [];

  for (const tagName of tagNames) {
    const normalizedName = tagName.toLowerCase().trim();

    // Find or create tag
    let tag = await Tag.findOne({ name: normalizedName });

    if (!tag) {
      // Create new tag if it doesn't exist
      tag = await Tag.create({ name: normalizedName });
    }

    tagIds.push(tag._id);
  }

  return tagIds;
}
