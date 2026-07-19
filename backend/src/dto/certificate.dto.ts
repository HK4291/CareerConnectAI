import { z } from "zod";

/**
 * Create Certificate
 */
export const createCertificateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Certificate name must be at least 2 characters.")
      .max(150, "Certificate name cannot exceed 150 characters."),

    issuer: z
      .string()
      .trim()
      .min(2, "Issuer is required.")
      .max(150, "Issuer cannot exceed 150 characters."),

    issueDate: z.coerce.date(),

    expiryDate: z.coerce.date().optional(),

    credentialId: z.string().trim().max(100).optional(),

    credentialUrl: z.string().trim().url("Invalid credential URL.").optional(),
  })
  .refine(
    (data) => {
      if (!data.expiryDate) return true;
      return data.issueDate <= data.expiryDate;
    },
    {
      message: "Expiry date cannot be before issue date.",
      path: ["expiryDate"],
    },
  );

export type CreateCertificateDto = z.infer<typeof createCertificateSchema>;

/**
 * Update Certificate
 */
export const updateCertificateSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),

    issuer: z.string().trim().min(2).max(150).optional(),

    issueDate: z.coerce.date().optional(),

    expiryDate: z.coerce.date().optional(),

    credentialId: z.string().trim().max(100).optional(),

    credentialUrl: z.string().trim().url().optional(),
  })
  .refine(
    (data) => {
      if (!data.issueDate || !data.expiryDate) return true;
      return data.issueDate <= data.expiryDate;
    },
    {
      message: "Expiry date cannot be before issue date.",
      path: ["expiryDate"],
    },
  );

export type UpdateCertificateDto = z.infer<typeof updateCertificateSchema>;

/**
 * Params
 */
export const certificateIdParamSchema = z.object({
  id: z.string().cuid(),
});
