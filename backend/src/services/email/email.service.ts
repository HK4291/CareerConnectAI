import { transporter } from "../../config/mail.config";
import { EmailOptions } from "../../interfaces/email.types";
import { env } from "../../config/env";

export class EmailService {
  async sendMail(options: EmailOptions): Promise<void> {
    await transporter.sendMail({
      from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_EMAIL}>`,

      to: options.to,

      subject: options.subject,

      html: options.html,

      text: options.text,
    });
  }
}

export const emailService = new EmailService();
