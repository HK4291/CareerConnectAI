import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../../controllers/project.controller";

const router = Router();

router.use(authenticate);

/**
 * Project Routes
 */
router.post("/", createProject);
router.get("/", getProjects);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
