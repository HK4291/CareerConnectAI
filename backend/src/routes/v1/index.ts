import { Router } from "express";
import healthRoutes from "../health.routes";
import authRoutes from "./auth.routes";
import candidateRoutes from "./candidate.routes";
import educationRoutes from "./education.routes";
import experienceRoutes from "./experience.routes";
import skillRoutes from "./skills.route";
import projectRoutes from "./project.routes";
import certificateRoutes from "./certificate.routes";
import resumeRoutes from "./resume.routes";
import atsRoutes from "./ats.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/candidate", candidateRoutes);
router.use("/education", educationRoutes);
router.use("/experience", experienceRoutes);
router.use("/skills", skillRoutes);
router.use("/projects", projectRoutes);
router.use("/certificate", certificateRoutes);
router.use("/resumes", resumeRoutes);
router.use("/ats", atsRoutes);

export default router;
