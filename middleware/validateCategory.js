const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  // Check required fields
  if (!name || name.trim() === "") {
    errors.push("Category name is required");
  }

  // Validate name length
  if (name && name.length > 50) {
    errors.push("Category name cannot exceed 50 characters");
  }

  // Validate description length if provided
  if (req.body.description && req.body.description.length > 200) {
    errors.push("Description cannot exceed 200 characters");
  }

  // Validate color if provided
  if (req.body.color && !/^#[0-9A-Fa-f]{6}$/.test(req.body.color)) {
    errors.push("Color must be a valid hex color code (e.g., #3b82f6)");
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

export default validateCategory;
