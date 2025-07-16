import express from "express";
import User from "../user/modals/User.js";
import CommentModal from "../comment/modals/Comment.js";
import BloggerModal from "../blogger/modals/Blogger.js";

const router = express.Router();

router.get("/admin", async (req, res) => {
  try {
    const activeUserCount = (
      await User.find({ role: "user", isActive: true, isDeleted: false })
    ).length;
    const activeBloggerCount = (
      await User.find({ role: "blogger", isActive: true, isDeleted: false })
    ).length;
    const activeCommentCount = (await CommentModal.find()).length;
    const activeBlogCount = (
      await BloggerModal.find({ isPublished: "published", isActive: true })
    ).length;

    return res.status(200).json({
      activeUserCount,
      activeBloggerCount,
      activeCommentCount,
      activeBlogCount,
    });
  } catch (error) {
    console.error("Error during fetching counts");
    res.status(500).json({ messgae: "Interval Server Error" });
  }
});

router.get("/blogger", async (req, res) => {
  const  id  = req.userId;
  try {
    const activeBlogCount = (
      await BloggerModal.find({ author: id, isDeleted: false })
    ).length;
    const activeCommentCount = (await CommentModal.find({ blogger: id }))
      .length;
    const publishedBlogCount =(await BloggerModal.find({
      author: id,
      isPublished: "published",
      isActive: true,
    })).length;
    const draftBlog = (
      await BloggerModal.find({ author: id, isPublished: false })
    ).length;

    return res.status(200).json({
      activeBlogCount,
      activeCommentCount,
      publishedBlogCount,
      draftBlog,
    });
  } catch (error) {
    console.error("Error during fetching counts");
    res.status(500).json({ messgae: "Interval Server Error" });
  }
});
export default router;
