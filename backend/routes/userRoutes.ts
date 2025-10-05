import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  deleteUserAccount,
  logoutUser,
  googleLogin,
  fetchAllUsers,
} from "@/controllers/userController";
import { authenticate } from "@/middlewares/authMiddleware";
import { uploadUserAvatar } from "@/middlewares/multer";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.use(authenticate);
router.get("/profile", getUserProfile);
router.patch("/profile", updateUserProfile);
router.post("/logout", logoutUser);
router.patch("/avatar", uploadUserAvatar, updateAvatar);
router.delete("/account", deleteUserAccount);
router.get("/allUsers", fetchAllUsers);

export default router;
