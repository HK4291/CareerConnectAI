import { emailService } from "../services/email";

export async function sendEmail(to: string, subject: string, html: string) {
  await emailService.sendMail({
    to,

    subject,

    html,
  });
}
