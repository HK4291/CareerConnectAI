import { Router } from "express";

import { recruiterController } from "../../controllers/recruiter.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authenticate, recruiterController.getProfile);

router.put("/profile", authenticate, recruiterController.updateProfile);

export default router;
