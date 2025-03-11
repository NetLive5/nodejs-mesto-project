import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/users";
import {
  validateUpdateAvatar,
  validateUpdateProfile,
  validateUserId,
} from "../middlewares/validation";

const router = Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateProfile, updateUserProfile);
router.patch("/me/avatar", validateUpdateAvatar, updateUserAvatar);
+router.get("/:userId", validateUserId, getUserById);
export default router;
