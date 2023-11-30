import express from "express";
import path from "path";
const router = express.Router();
const __dirname = path.resolve(path.dirname(""));
import { updateUser, verifyEmail } from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

router.get("/verify/:userId/:token", verifyEmail);

router.get("/verified", (req, res) => {
  res.sendFile(path.join("__dirname", "./views/build", index.html));
});
router.put("/update-user", updateUser);
export default router;
