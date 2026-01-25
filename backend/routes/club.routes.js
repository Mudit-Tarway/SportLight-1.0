import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMyClub, updateClub } from "../controllers/club.controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();
router.get("/me", protect, getMyClub);

router.put(
  "/me",
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "affiliation", maxCount: 1 },
  ]),
  updateClub
);

export default router;
