import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import {
  createCertificate,
  getCertificates,
  updateCertificate,
  deleteCertificate,
} from "../../controllers/certificate.controller";

const router = Router();

router.use(authenticate);

/**
 * Certificate Routes
 */

router.post("/", createCertificate);
router.get("/", getCertificates);
router.patch("/:id", updateCertificate);
router.delete("/:id", deleteCertificate);

export default router;
