import BloggerModal from "../blogger/modals/Blogger.js";
import UserModal from "../user/modals/User.js";
import { ROLE } from "../enums/role.js";
import slugify from "slugify";
import mongoose from "mongoose";

//genetrating unique slung
const generateUniqueSlug = async (title) => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await BloggerModal.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  return slug;
};

//Using-(POST)
export const createBlog = async (req, res) => {
  try {
    const userId = req.userId;

    //check if user is author
    const user = await UserModal.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== ROLE.AUTHOR) {
      return res.status(403).json({ message: "Only authors can create blogs" });
    }

    const {
      title,
      content,
      description,
      images,
      category,
      isPublished,
      publishedAt,
    } = req.body;

    const generatedSlug = await generateUniqueSlug(title);
    console.log(generatedSlug);

    const newBlog = new BloggerModal({
      title,
      slug: generatedSlug,
      content,
      description,
      images,
      author: userId,
      category,
      isActive: isPublished === "published",
      isPublished,
      publishedAt: isPublished ? publishedAt || new Date() : null,
    });
    await newBlog.save();

    return newBlog;
  } catch (error) {
    console.log({ error });

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Using-(GET)Allblog
export const getAllBlog = async () => {
  try {
    const aggregatestage = [
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "blog",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const blogs = await BloggerModal.aggregate(aggregatestage);

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }
    return blogs;
  } catch (error) {
    throw error;
  }
};


export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const blog = await BloggerModal.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "blog",
          as: "likes"
        },
      },
    ]);
    if (!blog) {
      return res.status(404).json({ message: "No blog found" });
    }
    return res.status(200).json(blog[0]);
  } catch (error) {
    throw error;
  }
};
// Using-(GET) getownblogs
export const getBlogsByUserId = async (userId) => {
  try {
    const user = await UserModal.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const blogs = await BloggerModal.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return blogs;
  } catch (err) {
    console.error("getBlogsByUserId - error:", err.message);
    throw err;
  }
};

//Using-(PUT)updatebyid
export const updateBlogById = async (id, body, updatedBy) => {
  try {
    const updatedBlog = await BloggerModal.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: Date.now(),
        updatedBy,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      throw new Error("Blog not found");
    }
    return updatedBlog;
  } catch (error) {
    throw error;
  }
};

// Using-Patch(softDelte)
export const softDeleteById = async (id, deletedBy) => {
  try {
    const blog = await BloggerModal.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        deletedBy,
        isActive: false,
      },
      { new: true }
    );
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  } catch (error) {
    throw error;
  }
};

//Using-Get(Search)
export const searchBlogs = async (keyword) => {
  try {
    const regex = new RegExp(keyword, "i");

    const blogs = await BloggerModal.find({
      isDeleted: { $ne: true },
      $or: [
        {
          title: regex,
        },
        {
          content: regex,
        },
        {
          category: regex,
        },
      ],
    }).sort({ createdAt: -1 });

    const trimmedBlogs = blogs.map((blog) => ({
      ...blog.toObject(),
      content:
        blog.content.slice(0, 100) + (blog.content.length > 100 ? "..." : ""),
    }));
    return trimmedBlogs;
  } catch (error) {
    throw error;
  }
};

export const getAllBlogss = async (req, res) => {
  try {
    const all = req.query.all === "true";

    const blogs = await BloggerModal.find(
      all ? {} : { isPublished: "published" }
    )
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .populate("category", "title")
      .lean();

    return blogs;
  } catch (err) {
    throw err;
  }
};
