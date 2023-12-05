import express from "express";
import {
  login,
  loginWithGoogle,
  register,
  registerWithGoogle,
} from "../controllers/authController.js";
const router = express.Router();




router.post("/register", register);
router.post("/login", login);

router.post("/loginWithGoogle", loginWithGoogle);
router.post("/registerWithGoogle", registerWithGoogle);
export default router;
