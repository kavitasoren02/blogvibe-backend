import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createComment,
  getCommentByBlogId,
} from "../comment/CommentService.js";

const router = express.Router();

router.post("/comment", authenticate, async (req, res) => {
  try {
    const newComment = await createComment(req, res);
    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
});

router.get("/getcomment/:blogId", async (req, res) => {
  try {
    const getCommentById = await getCommentByBlogId(req, res);
    res.status(200).json({
      message: "Comment fetched successfully",
      getCommentById: getCommentById,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
});

export default router;
