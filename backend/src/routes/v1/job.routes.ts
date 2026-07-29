import { Router } from "express";

import jobController from "../../controllers/job.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  updateJobSchema,
  jobSearchSchema,
} from "../../validations/job.validator";
import { savedJobQuerySchema } from "../../validations/job.validator";

const router = Router();

router.post("/", authenticate, jobController.createJob);

router.get("/my", authenticate, jobController.getRecruiterJobs);

router.get(
  "/search",
  validate(jobSearchSchema, "query"),
  jobController.searchJobs,
);

router.get(
  "/saved",
  authenticate,
  validate(savedJobQuerySchema, "query"),
  jobController.getSavedJobs,
);

router.post("/:jobId/save", authenticate, jobController.saveJob);

router.delete("/:jobId/save", authenticate, jobController.unsaveJob);

router.get("/:jobId", authenticate, jobController.getJobById);

router.patch(
  "/:jobId",
  authenticate,
  validate(updateJobSchema),
  jobController.updateJob,
);

router.delete("/:jobId", authenticate, jobController.deleteJob);

export default router;
