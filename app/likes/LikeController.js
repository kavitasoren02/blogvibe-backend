import express from "express";
import { createLike } from "./LikeService.js";

const router = express.Router();

router.post("/createlike", async (req, res) => {
  try {
    const like = await createLike(req, res);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
