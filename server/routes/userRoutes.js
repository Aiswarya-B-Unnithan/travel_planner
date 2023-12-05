import express from "express";
import path from "path";
const router = express.Router();
const __dirname = path.resolve(path.dirname(""));
import {
  changePassword,
  resetPassword,
  updateUser,
  verifyEmail,
} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";
import { requestPasswordReset } from "../controllers/userController.js";

router.get("/verify/:userId/:token", verifyEmail);

router.get("/verified", (req, res) => {
  res.sendFile(path.join("__dirname", "./views/build", index.html));
});
router.put("/update-user", updateUser);

router.get("/profile/:userId", getUserProfile);

// PASSWORD RESET
router.post("/request-passwordreset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);
router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});
export default router;
