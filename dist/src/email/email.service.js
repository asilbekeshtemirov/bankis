"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendVerificationEmail(email, code) {
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
        }
        catch (error) {
            this.logger.error('Failed to send verification email:', error);
            throw error;
        }
    }
    async sendPasswordResetEmail(email, code) {
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
        }
        catch (error) {
            this.logger.error('Failed to send password reset email:', error);
            throw error;
        }
    }
    async sendTransactionVerificationEmail(email, code, amount, toAccount) {
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
        }
        catch (error) {
            this.logger.error('Failed to send transaction verification email:', error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map