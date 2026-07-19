import { Certificate } from "@prisma/client";

import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from "../dto/certificate.dto";

export interface ICertificateService {
  /**
   * Create Certificate
   */
  createCertificate(
    userId: string,
    data: CreateCertificateDto,
  ): Promise<Certificate>;

  /**
   * Get Certificates
   */
  getCertificates(userId: string): Promise<Certificate[]>;

  /**
   * Update Certificate
   */
  updateCertificate(
    userId: string,
    certificateId: string,
    data: UpdateCertificateDto,
  ): Promise<Certificate>;

  /**
   * Delete Certificate
   */
  deleteCertificate(
    userId: string,
    certificateId: string,
  ): Promise<Certificate>;
}
