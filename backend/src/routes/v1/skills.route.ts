import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../../controllers/skill.controller";

const router = Router();

router.use(authenticate);

router.post("/", createSkill);
router.get("/", getSkills);
router.patch("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
