import { Router } from "express";

import { resumeController } from "../../controllers/resume.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { uploadResume } from "../../middlewares/upload.middleware";

const router = Router();

router.use(authenticate);

router.post("/", uploadResume.single("resume"), resumeController.uploadResume);
router.get("/", resumeController.getResumes);
router.get("/active", resumeController.getActiveResume);
router.delete("/:resumeId", resumeController.deleteResume);
router.post(
  "/:resumeId/import",
  authenticate,
  resumeController.importResume.bind(resumeController),
);
router.get(
  "/:resumeId/versions",
  authenticate,
  resumeController.getResumeVersions.bind(resumeController),
);

export default router;
