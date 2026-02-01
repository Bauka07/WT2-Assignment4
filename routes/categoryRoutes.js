import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import validateCategory from "../middleware/validateCategory.js";

const router = express.Router();

// Public routes (GET)
router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);

// Protected routes (POST, PUT, DELETE) - Admin only
router
  .route("/")
  .post(authenticate, authorize(["admin"]), validateCategory, createCategory);

router
  .route("/:id")
  .put(authenticate, authorize(["admin"]), validateCategory, updateCategory)
  .delete(authenticate, authorize(["admin"]), deleteCategory);

export default router;
