import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMyProfile, updatePlayer } from "../controllers/player.controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();
router.get("/me", protect, getMyProfile);
router.put("/me", protect, upload.single("achievementImage"), updatePlayer);


export default router;
