import express from "express";
import { createPost, getPost } from "../controllers/postController.js";

const router = express.Router();

//create post
router.post("/createPost", createPost);
//get post
router.post("/", getPost);

//get induvidualpost
router.post("/:id", getPost);

export default router;
