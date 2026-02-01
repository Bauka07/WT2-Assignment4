import express from "express";
import { authenticate, authorize } from "../middleware/authenticate.js";
import {
  // Users
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  // Notes
  getAllNotesAdmin,
  deleteNoteAdmin,
  // Categories
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  // Tags
  createTagAdmin,
  updateTagAdmin,
  deleteTagAdmin,
  // Dashboard
  getDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes require admin
router.use(authenticate);
router.use(authorize(["admin"]));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users CRUD
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Notes (all users' notes)
router.get("/notes", getAllNotesAdmin);
router.delete("/notes/:id", deleteNoteAdmin);

// Categories CRUD
router.post("/categories", createCategoryAdmin);
router.put("/categories/:id", updateCategoryAdmin);
router.delete("/categories/:id", deleteCategoryAdmin);

// Tags CRUD
router.post("/tags", createTagAdmin);
router.put("/tags/:id", updateTagAdmin);
router.delete("/tags/:id", deleteTagAdmin);

export default router;
