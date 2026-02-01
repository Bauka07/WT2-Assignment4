import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import validateNote from "../middleware/validateNote.js";
import { authenticate, optionalAuth } from "../middleware/authenticate.js";

const router = express.Router();

// Public GET routes with optional authentication
router.route("/").get(optionalAuth, getAllNotes);

router.route("/:id").get(optionalAuth, getNoteById);

// Protected POST route (authenticated users)
router.route("/").post(authenticate, validateNote, createNote);

// Protected PUT and DELETE routes (authenticated users)
router
  .route("/:id")
  .put(authenticate, validateNote, updateNote)
  .delete(authenticate, deleteNote);

export default router;
