import { Router } from "express";

import jobController from "../../controllers/job.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, jobController.createJob);

export default router;
