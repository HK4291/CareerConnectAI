import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
} from "../../controllers/experience.controller";

const router = Router();

/**
 * Experience Routes
 */

router.post("/", authenticate, createExperience);
router.get("/", authenticate, getExperiences);
router.patch("/:id", authenticate, updateExperience);
router.delete("/:id", authenticate, deleteExperience);

export default router;
