// Notification Service for Email and SMS
import nodemailer from 'nodemailer';

// Email Service Configuration
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface NotificationData {
  to: string;
  templateId: string;
  variables: Record<string, any>;
}

class NotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private smsClient: any = null;

  constructor() {
    this.initializeEmailService();
    this.initializeSMSService();
  }

  // Initialize Email Service (using Nodemailer with Gmail/SMTP)
  private initializeEmailService() {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.emailTransporter = nodemailer.createTransporter(emailConfig);
  }

  // Initialize SMS Service (using Twilio)
  private initializeSMSService() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      // In a real implementation, you would import and initialize Twilio client
      // const twilio = require('twilio');
      // this.smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  // Email Templates
  private getEmailTemplate(templateId: string, variables: Record<string, any>): EmailTemplate {
    const templates: Record<string, (vars: Record<string, any>) => EmailTemplate> = {
      welcome: (vars) => ({
        subject: 'Welcome to Indian Matrimony!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #e11d48, #ec4899); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to Indian Matrimony</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #374151;">Hello ${vars.name}!</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Welcome to India's most trusted matrimony platform. We're excited to help you find your perfect life partner.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151;">Next Steps:</h3>
                <ul style="color: #6b7280;">
                  <li>Complete your profile with photos and details</li>
                  <li>Set your partner preferences</li>
                  <li>Start browsing compatible matches</li>
                  <li>Upgrade to premium for unlimited access</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vars.profileUrl}" style="background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Complete Your Profile
                </a>
              </div>
            </div>
            <div style="background: #374151; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">© 2024 Indian Matrimony. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Welcome to Indian Matrimony! Hello ${vars.name}, we're excited to help you find your perfect life partner. Complete your profile at ${vars.profileUrl}`
      }),

      emailVerification: (vars) => ({
        subject: 'Verify Your Email Address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #3b82f6; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Email Verification</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #374151;">Verify Your Email</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Please click the button below to verify your email address and activate your account.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vars.verificationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                If you didn't create an account, please ignore this email.
              </p>
            </div>
          </div>
        `,
        text: `Verify your email address by clicking: ${vars.verificationUrl}`
      }),

      newMatch: (vars) => ({
        subject: 'New Match Found!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Match Found! 💕</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #374151;">Hello ${vars.userName}!</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Great news! We found a new match that fits your preferences.
              </p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #065f46; margin-top: 0;">${vars.matchName}</h3>
                <p style="color: #047857; margin: 5px 0;">Age: ${vars.matchAge} | ${vars.matchLocation}</p>
                <p style="color: #047857; margin: 5px 0;">${vars.matchProfession}</p>
                <p style="color: #047857; margin: 5px 0;">Compatibility: ${vars.compatibility}%</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vars.profileUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  View Profile
                </a>
              </div>
            </div>
          </div>
        `,
        text: `New match found! ${vars.matchName}, ${vars.matchAge}, ${vars.matchLocation}. View profile: ${vars.profileUrl}`
      }),

      interestReceived: (vars) => ({
        subject: 'Someone is interested in your profile!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Interest Received! ⭐</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #374151;">Hello ${vars.userName}!</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                ${vars.senderName} has shown interest in your profile!
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vars.interestUrl}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  View Interest
                </a>
              </div>
            </div>
          </div>
        `,
        text: `${vars.senderName} has shown interest in your profile! View: ${vars.interestUrl}`
      }),

      passwordReset: (vars) => ({
        subject: 'Reset Your Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Password Reset</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #374151;">Reset Your Password</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Click the button below to reset your password. This link will expire in 1 hour.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vars.resetUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
        `,
        text: `Reset your password: ${vars.resetUrl}`
      }),

      premiumUpgrade: (vars) => ({
        subject: 'Welcome to Premium Membership!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #7c3aed, #5b21b6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to Premium! 👑</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #374151;">Hello ${vars.userName}!</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Congratulations! Your premium membership is now active.
              </p>
              <div style="background: #faf5ff; border: 1px solid #e9d5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #6b21a8;">Premium Benefits:</h3>
                <ul style="color: #7c2d92;">
                  <li>Unlimited profile views</li>
                  <li>Advanced search filters</li>
                  <li>See who viewed your profile</li>
                  <li>Priority customer support</li>
                  <li>Verified badge on profile</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vars.dashboardUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Explore Premium Features
                </a>
              </div>
            </div>
          </div>
        `,
        text: `Welcome to Premium! Your premium membership is now active. Explore features: ${vars.dashboardUrl}`
      })
    };

    const templateFn = templates[templateId];
    if (!templateFn) {
      throw new Error(`Email template '${templateId}' not found`);
    }

    return templateFn(variables);
  }

  // SMS Templates
  private getSMSTemplate(templateId: string, variables: Record<string, any>): string {
    const templates: Record<string, (vars: Record<string, any>) => string> = {
      phoneVerification: (vars) => 
        `Your Indian Matrimony verification code is: ${vars.otp}. Valid for 10 minutes. Do not share this code.`,
      
      newMatch: (vars) => 
        `New match found! ${vars.matchName} (${vars.compatibility}% match) is interested. View: ${vars.profileUrl}`,
      
      interestReceived: (vars) => 
        `${vars.senderName} showed interest in your profile! Respond now: ${vars.interestUrl}`,
      
      passwordReset: (vars) => 
        `Reset your Indian Matrimony password: ${vars.resetUrl}. Link expires in 1 hour.`,
      
      premiumUpgrade: (vars) => 
        `Welcome to Premium! Your membership is active. Enjoy unlimited features: ${vars.dashboardUrl}`,
      
      meetingReminder: (vars) => 
        `Reminder: Meeting with ${vars.matchName} tomorrow at ${vars.time}. Location: ${vars.location}`,
    };

    const templateFn = templates[templateId];
    if (!templateFn) {
      throw new Error(`SMS template '${templateId}' not found`);
    }

    return templateFn(variables);
  }

  // Send Email
  async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      if (!this.emailTransporter) {
        throw new Error('Email service not initialized');
      }

      const template = this.getEmailTemplate(data.templateId, data.variables);

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@indianmatrimony.com',
        to: data.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Send SMS
  async sendSMS(data: NotificationData): Promise<boolean> {
    try {
      if (!this.smsClient) {
        console.log('SMS service not configured, skipping SMS');
        return false;
      }

      const message = this.getSMSTemplate(data.templateId, data.variables);

      // In a real implementation with Twilio:
      // const result = await this.smsClient.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_FROM_NUMBER,
      //   to: data.to
      // });

      console.log('SMS sent successfully to:', data.to);
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Send both Email and SMS
  async sendNotification(emailData: NotificationData, smsData?: NotificationData): Promise<{
    email: boolean;
    sms: boolean;
  }> {
    const results = {
      email: false,
      sms: false,
    };

    // Send email
    results.email = await this.sendEmail(emailData);

    // Send SMS if data provided
    if (smsData) {
      results.sms = await this.sendSMS(smsData);
    }

    return results;
  }

  // Bulk email sending
  async sendBulkEmail(recipients: string[], templateId: string, variables: Record<string, any>): Promise<{
    success: number;
    failed: number;
  }> {
    const results = { success: 0, failed: 0 };

    for (const recipient of recipients) {
      const success = await this.sendEmail({
        to: recipient,
        templateId,
        variables,
      });

      if (success) {
        results.success++;
      } else {
        results.failed++;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  // Generate OTP
  generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  // Verify email service health
  async verifyEmailService(): Promise<boolean> {
    try {
      if (!this.emailTransporter) return false;
      await this.emailTransporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export types
export type { NotificationData, EmailTemplate };

// Utility functions for common notifications
export const sendWelcomeEmail = async (email: string, name: string, profileUrl: string) => {
  return await notificationService.sendEmail({
    to: email,
    templateId: 'welcome',
    variables: { name, profileUrl },
  });
};

export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  return await notificationService.sendEmail({
    to: email,
    templateId: 'emailVerification',
    variables: { verificationUrl },
  });
};

export const sendPhoneVerificationSMS = async (phone: string, otp: string) => {
  return await notificationService.sendSMS({
    to: phone,
    templateId: 'phoneVerification',
    variables: { otp },
  });
};

export const sendNewMatchNotification = async (
  email: string,
  phone: string,
  userName: string,
  matchData: any
) => {
  return await notificationService.sendNotification(
    {
      to: email,
      templateId: 'newMatch',
      variables: { userName, ...matchData },
    },
    {
      to: phone,
      templateId: 'newMatch',
      variables: { ...matchData },
    }
  );
};
