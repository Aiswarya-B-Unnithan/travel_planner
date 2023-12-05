import express from "express";
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import postRouter from "./postRoutes.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/posts", postRouter);
export default router;
