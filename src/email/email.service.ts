import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true agar SSL ishlatilsa
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  

  async sendVerificationEmail(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"BankIS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification - BankIS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Email Verification</h2>
            <p>Thank you for registering with BankIS. Please verify your email address by entering the following code:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 5px;">${code}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't create an account with BankIS, please ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"BankIS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset - BankIS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Password Reset</h2>
            <p>You requested to reset your password for your BankIS account. Please use the following code:</p>
            <div style="background-color: #fef2f2; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #fecaca;">
              <h1 style="color: #991b1b; font-size: 32px; letter-spacing: 5px;">${code}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  async sendTransactionVerificationEmail(email: string, code: string, amount: number, toAccount: string) {
    try {
      await this.transporter.sendMail({
        from: `"BankIS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Transaction Verification - BankIS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Transaction Verification</h2>
            <p>You initiated a transaction from your BankIS account. Please verify this transaction:</p>
            <div style="background-color: #f0fdf4; padding: 20px; margin: 20px 0; border: 1px solid #bbf7d0;">
              <p><strong>Amount:</strong> ${amount.toLocaleString()} UZS</p>
              <p><strong>To Account:</strong> ${toAccount}</p>
            </div>
            <p>Please enter the following verification code to complete the transaction:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 5px;">${code}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't initiate this transaction, please contact our support immediately.</p>
          </div>
        `,
      });
      this.logger.log(`Transaction verification email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send transaction verification email:', error);
      throw error;
    }
  
  }
}