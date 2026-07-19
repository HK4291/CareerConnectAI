import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import {
  deleteProfile,
  getMyProfile,
  getProfileStats,
  updateProfile,
} from "../../controllers/candidate.controller";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.patch("/", authenticate, updateProfile);
router.delete("/", authenticate, deleteProfile);
router.get("/stats", authenticate, getProfileStats);

export default router;
