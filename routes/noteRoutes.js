import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import validateNote from "../middleware/validateNote.js";

const router = express.Router();

// Routes
router.route("/").post(validateNote, createNote).get(getAllNotes);

router
  .route("/:id")
  .get(getNoteById)
  .put(validateNote, updateNote)
  .delete(deleteNote);

export default router;
