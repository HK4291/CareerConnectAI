import { Router } from "express";

import { atsController } from "../../controllers/ats.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { uploadResume } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/analyze/:resumeId", authenticate, atsController.analyzeResume);
router.post(
  "/analyze",
  authenticate,
  uploadResume.single("resume"),
  atsController.quickAnalyzeResume,
);

export default router;
