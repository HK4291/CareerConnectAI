import { Router } from "express";

import jobController from "../../controllers/job.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateJobSchema } from "../../validations/job.validator";

const router = Router();

router.post("/", authenticate, jobController.createJob);
router.get("/my", authenticate, jobController.getRecruiterJobs);
router.get("/:jobId", authenticate, jobController.getJobById);
router.patch(
  "/:jobId",
  authenticate,
  validate(updateJobSchema),
  jobController.updateJob,
);
router.delete("/:jobId", authenticate, jobController.deleteJob);

export default router;
