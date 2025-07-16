import CommentModal from "../comment/modals/Comment.js";
import BloggerModal from "../blogger/modals/Blogger.js";

//Using-(POST)
export const createComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { blogId, commentText } = req.body;

    // Validate input
    if (!blogId || !commentText) {
      return res
        .status(400)
        .json({ message: "Blog ID and comment text are required" });
    }

    // Check if the blog exists
    const blog = await BloggerModal.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Create new comment
    const newComment = new CommentModal({
      blog: blogId,
      user: userId,
      comment: commentText,
      blogger: blog.author
    });

    // Save comment to database
    await newComment.save();

    return newComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getCommentByBlogId = async (req, res) => {
  try {
    const  {blogId} = req.params;
    console.log(blogId);
    
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required." });
    }
    const comments = await CommentModal.find({blog: blogId })
    .populate({
      path: "blog" , 
    })
    .populate("blogger")
    .populate("user")
    .sort({
      createdAt: -1,
    });
    return comments;
  } catch (error) {
    throw error;
  }
};
