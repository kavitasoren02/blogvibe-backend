import express from "express";
import {
  createBlog,
  getAllBlog,
  getAllBlogss,
  getBlogById,
  getBlogsByUserId,
  searchBlogs,
  softDeleteById,
  updateBlogById,
} from "./Bloggerservice.js";
import { validateBlogger } from "./validation/validateBlogger.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createblog", authenticate, validateBlogger, async (req, res) => {
  try {
    const newBlog = await createBlog(req, res);
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating during blog.", error);
    res
      .status(500)
      .json({ message: "Failed to create blog", error: error.message });
  }
});

router.get("/getallblogs", async (req, res) => {
  try {
    const allBlogs = await getAllBlog(req, res);

    if (!allBlogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json({ allBlogs });
  } catch (error) {
    console.error("Error fetching users.", error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

router.get("/getblog/:id", async (req, res) => {
  try {
    await getBlogById(req, res);
  } catch (error) {
    console.error("Error fetching blog by ID.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/ownblogs/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    const ownBlogs = await getBlogsByUserId(userId);

    if (!ownBlogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }
    return res.status(200).json({ ownBlogs });
  } catch (error) {
    console.error("Error fetching users.", error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

router.put("/updateblog/:id", authenticate, async (req, res) => {
  try {
    const blogId = req.params.id;
    // console.log(blogId);

    const updatedData = req.body;
    const updatedBy = req.userId;

    const updatedBlog = await updateBlogById(blogId, updatedData, updatedBy);

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/softdelete/:id", authenticate, async (req, res) => {
  try {
    const blogId = req.params.id;
    const deleteBy = req.userId;

    const deleteBlog = await softDeleteById(blogId, deleteBy);

    res.status(200).json({
      blog: deleteBlog,
    });
  } catch (error) {
    console.error("Error soft-deleting blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Search keyword is required" });
    }
    const blogs = await searchBlogs(keyword);

    if (!blogs) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error searching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/allblogs", async (req, res) => {
  try {
    const allBlogs = await getAllBlogss(req, res);
    if (!allBlogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.status(200).json({ allBlogs });
  } catch (error) {
    console.error("Error fetching blog by ID.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
