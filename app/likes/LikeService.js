import BloggerModal from "../blogger/modals/Blogger.js";
import LikeModal from "./modals/Like.js";

//Using-(POST)
export const createLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is requiered " });
    }

    const blog = await BloggerModal.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const exsistingLike = await LikeModal.findOne({
      blog: blogId,
      user: userId,
    });
    if (exsistingLike) {
      return res.status(400).json({ message: "You have already liked this" });
    }

    const like = new LikeModal({
      blog: blogId,
      user: userId,
    });

    await like.save();
    return res.status(201).json({ message: "Liked successfully", like });
  } catch (error) {
    console.error("Error in createLike:", error);
    throw error;
  }
};
