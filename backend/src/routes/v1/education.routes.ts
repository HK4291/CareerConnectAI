import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
} from "../../controllers/education.controller";

const router = Router();

router.post("/", authenticate, createEducation);
router.get("/", authenticate, getEducations);
router.patch("/:id", authenticate, updateEducation);
router.delete("/:id", authenticate, deleteEducation);

export default router;
