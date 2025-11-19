import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private resend: Resend;
  private sender: string;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    this.sender = process.env.RESEND_FROM || "No Reply <no-reply@example.com>";

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOtpEmail(to: string, code: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your Verification Code</h2>
        <p>Please use the following code to verify your email:</p>
        <h1 style="letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.sender,
        to,
        subject: "Your Verification Code",
        html,
      });

      return true;
    } catch (error) {
      console.error("Resend Error:", error);
      throw new InternalServerErrorException("Failed to send email");
    }
  }
}
