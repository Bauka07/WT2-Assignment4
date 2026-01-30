import express from "express";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";
import validateTag from "../middleware/validateTag.js";

const router = express.Router();

// Routes
router.route("/").post(validateTag, createTag).get(getAllTags);

router
  .route("/:id")
  .get(getTagById)
  .put(validateTag, updateTag)
  .delete(deleteTag);

export default router;
