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
} from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadUserAvatar } from "../middlewares/multer";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: "Too many attempts, please try again after 15 minutes",
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/google-login", authLimiter, googleLogin);
router.use(authenticate);
router.get("/profile", getUserProfile);
router.patch("/profile", updateUserProfile);
router.post("/logout", logoutUser);
router.patch("/avatar", uploadUserAvatar, updateAvatar);
router.delete("/account", deleteUserAccount);
router.get("/allUsers", fetchAllUsers);

export default router;
