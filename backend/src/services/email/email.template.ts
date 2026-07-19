export class EmailTemplates {
  static verification(name: string, link: string) {
    return `
            <h2>Hello ${name}</h2>

            <p>Welcome to CareerPilot.ai</p>

            <p>This link expires in 15 minutes.</p>
        `;
  }

  static resetPassword(name: string, otp: string) {
    return `
            <h2>Hello ${name}</h2>

            <p>here is your otp for the reset password. ${otp}</p>
        `;
  }

  static otp(name: string, otp: string) {
    return `
            <h2>Welcome ${name}</h2>

            <h1>here is your otp for verification${otp}</h1>

            <p>This OTP expires in 10 minutes.</p>
        `;
  }

  static welcome(name: string) {
    return `
            <h1>Welcome ${name}</h1>

            <p>
                Thank you for joining CareerPilot AI.
            </p>
        `;
  }

  static loginAlert(device: string, location: string) {
    return `
            <h2>New Login</h2>

            <p>Device : ${device}</p>

            <p>Location : ${location}</p>
        `;
  }

  static resumeCompleted(name: string) {
    return `
            <h2>Hello ${name}</h2>

            <p>Your Resume Analysis is Ready.</p>
        `;
  }

  static interviewScheduled(company: string, date: string) {
    return `
            <h2>Interview Scheduled</h2>

            <p>${company}</p>

            <p>${date}</p>
        `;
  }
}
