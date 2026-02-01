import express from "express";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";
import validateTag from "../middleware/validateTag.js";
import { authenticate, authorize } from "../middleware/authenticate.js";

const router = express.Router();

// Public routes (GET)
router.route("/").get(getAllTags);
router.route("/:id").get(getTagById);

// Protected routes (POST, PUT, DELETE) - Admin only
router
  .route("/")
  .post(authenticate, authorize(["admin"]), validateTag, createTag);

router
  .route("/:id")
  .put(authenticate, authorize(["admin"]), validateTag, updateTag)
  .delete(authenticate, authorize(["admin"]), deleteTag);

export default router;
