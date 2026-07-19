import asyncHandler from "../middlewares/asyncHandler";

import sendResponse from "../utils/sendResponse";

import { certificateService } from "../services/certificate/certificate.service";

import {
  createCertificateSchema,
  updateCertificateSchema,
  certificateIdParamSchema,
} from "../dto/certificate.dto";

/**
 * POST /certificates
 */
export const createCertificate = asyncHandler(async (req, res) => {
  const validatedData = createCertificateSchema.parse(req.body);

  const certificate = await certificateService.createCertificate(
    req.user!.id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Certificate added successfully.",
    data: certificate,
  });
});

/**
 * GET /certificates
 */
export const getCertificates = asyncHandler(async (req, res) => {
  const certificates = await certificateService.getCertificates(req.user!.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Certificates fetched successfully.",
    data: certificates,
  });
});

/**
 * PATCH /certificates/:id
 */
export const updateCertificate = asyncHandler(async (req, res) => {
  const { id } = certificateIdParamSchema.parse(req.params);

  const validatedData = updateCertificateSchema.parse(req.body);

  const certificate = await certificateService.updateCertificate(
    req.user!.id,
    id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Certificate updated successfully.",
    data: certificate,
  });
});

/**
 * DELETE /certificates/:id
 */
export const deleteCertificate = asyncHandler(async (req, res) => {
  const { id } = certificateIdParamSchema.parse(req.params);

  await certificateService.deleteCertificate(req.user!.id, id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Certificate deleted successfully.",
    data: null,
  });
});
