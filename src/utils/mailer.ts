import UserModel from '@/models/user.model';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export async function sendMail({
    email,
    emailType,
    userId,
}: {
    email: string;
    emailType: string;
    userId: string;
}) {
    try {
        const hashedToken = uuidv4();

        if (emailType === 'VERIFY') {
            await UserModel.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 60 * 60 * 1000,
                },
            });
        } else if (emailType === 'RESET') {
            await UserModel.findByIdAndUpdate(userId, {
                $set: {
                    forgetPasswordToken: hashedToken,
                    forgetPasswordTokenExpiry: Date.now() + 60 * 60 * 1000,
                },
            });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASSWORD,
            },
        });

        const verificationLink = `${process.env.DOMAIN}/verify-email?token=${hashedToken}`;
        const resetLink = `${process.env.DOMAIN}/reset-email?token=${hashedToken}`;

        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL!,
            to: email,
            subject:
                emailType === 'VERIFY'
                    ? 'Verify your email'
                    : 'Reset your password',
            text: 'Hello world?',
            html: `<!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style type="text/css">
                                /* Reset styles */
                                body, p, table, td {
                                    margin: 0;
                                    padding: 0;
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                }
                                /* Container styles */
                                .email-container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #ffffff;
                                }
                                .header {
                                    text-align: center;
                                    padding: 30px 0;
                                    background-color: #f8f9fa;
                                    border-radius: 8px 8px 0 0;
                                }
                                .content {
                                    padding: 40px 20px;
                                    background-color: #ffffff;
                                    border: 1px solid #e9ecef;
                                    border-radius: 0 0 8px 8px;
                                }
                                .button {
                                    display: inline-block;
                                    padding: 12px 30px;
                                    background-color: #007bff;
                                    color: #ffffff !important;
                                    text-decoration: none;
                                    border-radius: 5px;
                                    margin: 20px 0;
                                    font-weight: bold;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 20px;
                                    color: #6c757d;
                                    font-size: 12px;
                                }
                                @media only screen and (max-width: 480px) {
                                    .email-container {
                                        width: 100% !important;
                                        padding: 10px;
                                    }
                                }
                            </style>
                        </head>
                        <body style="background-color: #f5f5f5; padding: 20px;">
                            <div class="email-container">
                                <div class="header">
                                    <h1 style="color: #333333; margin: 0;">
                                        ${
                                            emailType === 'VERIFY'
                                                ? 'Verify Your Email'
                                                : 'Reset Your Password'
                                        }
                                    </h1>
                                </div>
                                <div class="content">
                                    <p>Hello,</p>
                                    
                                    ${
                                        emailType === 'VERIFY'
                                            ? `
                                    <p>Thank you for signing up! To complete your registration and verify your email address, please click the button below:</p>
                                    <div style="text-align: center;">
                                        <a href="${verificationLink}" class="button">Verify Email Address</a>
                                    </div>
                                    <p>This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
                                    `
                                            : `
                                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                                    <div style="text-align: center;">
                                        <a href="${resetLink}" class="button">Reset Password</a>
                                    </div>
                                    <p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
                                    `
                                    }
                                    
                                    <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
                                    <p style="word-break: break-all; color: #6c757d; font-size: 12px;">
                                        ${
                                            emailType === 'VERIFY'
                                                ? verificationLink
                                                : resetLink
                                        }
                                    </p>
                                    
                                    <p>Best regards,<br>Fuyad Hasan Fahim</p>
                                </div>
                                <div class="footer">
                                    <p>This is an automated message, please do not reply to this email.</p>
                                    <p>© 2025 Your Company Name. All rights reserved.</p>
                                </div>
                            </div>
                        </body>
                        </html>`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}
