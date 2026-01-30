const validateNote = (req, res, next) => {
  const { title, content, category } = req.body;
  const errors = [];

  // Check required fields
  if (!title || title.trim() === "") {
    errors.push("Title is required");
  }

  if (!content || content.trim() === "") {
    errors.push("Content is required");
  }

  if (!category || category.trim() === "") {
    errors.push("Category is required");
  }

  // Validate category enum
  const validCategories = [
    "Work",
    "Personal",
    "Ideas",
    "Study",
    "Todo",
    "Other",
  ];
  if (category && !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(", ")}`);
  }

  // Validate color if provided
  if (req.body.color && !/^#[0-9A-Fa-f]{6}$/.test(req.body.color)) {
    errors.push("Color must be a valid hex color code (e.g., #ffffff)");
  }

  // If there are validation errors, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

export default validateNote;
