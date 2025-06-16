export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendVerificationEmail(email: string, code: string): Promise<void>;
    sendPasswordResetEmail(email: string, code: string): Promise<void>;
    sendTransactionVerificationEmail(email: string, code: string, amount: number, toAccount: string): Promise<void>;
}
