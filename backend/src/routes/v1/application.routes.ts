import { Router } from "express";

import applicationController from "../../controllers/application.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  applyJobParamsSchema,
  applyJobBodySchema,
} from "../../validations/application.validation";

const router = Router();

/**
 * Candidate Routes
 */

// Apply Job
router.post(
  "/:jobId/apply",
  authenticate,
  validate(applyJobParamsSchema, "params"),
  validate(applyJobBodySchema),
  applicationController.applyJob,
);

export default router;
