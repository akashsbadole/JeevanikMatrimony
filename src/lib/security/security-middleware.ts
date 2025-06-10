// Enhanced Security Middleware for Matrimony Platform
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Rate Limiting Configuration
export const rateLimitConfig = {
  // General API rate limiting
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true,
  },
  
  // Search endpoints
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 search requests per minute
    message: 'Too many search requests, please slow down.',
  },
  
  // Message sending
  messaging: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each user to 10 messages per minute
    message: 'Too many messages sent, please wait before sending more.',
  },
  
  // Interest sending
  interests: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each user to 5 interests per minute
    message: 'Too many interests sent, please wait before sending more.',
  }
};

// Security Headers Configuration
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.matrimony.com wss:;
    media-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim()
};

// Input Validation and Sanitization
export class InputValidator {
  private static readonly patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    name: /^[a-zA-Z\s]{2,50}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  };

  static validateEmail(email: string): boolean {
    return this.patterns.email.test(email);
  }

  static validatePhone(phone: string): boolean {
    return this.patterns.phone.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validatePassword(password: string): boolean {
    return this.patterns.password.test(password);
  }

  static validateName(name: string): boolean {
    return this.patterns.name.test(name);
  }

  static sanitizeString(input: string): string {
    return input
      .replace(/[<>\"'%;()&+]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  }

  static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value);
        } else if (typeof value === 'object') {
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
    
    return obj;
  }

  static validateAge(dateOfBirth: string): boolean {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18 && age - 1 <= 100;
    }
    
    return age >= 18 && age <= 100;
  }
}

// CSRF Protection
export class CSRFProtection {
  private static readonly SECRET_KEY = process.env.CSRF_SECRET || 'default-csrf-secret';

  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const data = `${sessionId}:${timestamp}`;
    const hash = crypto.createHmac('sha256', this.SECRET_KEY).update(data).digest('hex');
    return `${timestamp}:${hash}`;
  }

  static validateToken(token: string, sessionId: string): boolean {
    try {
      const [timestamp, hash] = token.split(':');
      const data = `${sessionId}:${timestamp}`;
      const expectedHash = crypto.createHmac('sha256', this.SECRET_KEY).update(data).digest('hex');
      
      // Check if token is valid and not expired (1 hour)
      const tokenAge = Date.now() - parseInt(timestamp);
      const isExpired = tokenAge > 60 * 60 * 1000; // 1 hour
      
      return hash === expectedHash && !isExpired;
    } catch {
      return false;
    }
  }
}

// SQL Injection Prevention
export class SQLInjectionPrevention {
  private static readonly dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|\/\*|\*\/|;|'|"|`)/g,
    /(\bOR\b|\bAND\b).*?[=<>]/gi,
    /\b(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)\b/gi
  ];

  static containsSQLInjection(input: string): boolean {
    return this.dangerousPatterns.some(pattern => pattern.test(input));
  }

  static sanitizeSQL(input: string): string {
    // Remove dangerous SQL patterns
    let sanitized = input;
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    return sanitized.trim();
  }
}

// XSS Prevention
export class XSSPrevention {
  private static readonly xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
  ];

  static containsXSS(input: string): boolean {
    return this.xssPatterns.some(pattern => pattern.test(input));
  }

  static sanitizeHTML(input: string): string {
    let sanitized = input;
    this.xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Encode HTML entities
    return sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

// Security Audit Logger
export class SecurityAuditLogger {
  static async logSecurityEvent(event: {
    type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'csrf_violation' | 'xss_attempt' | 'sql_injection_attempt';
    userId?: string;
    ipAddress: string;
    userAgent: string;
    details?: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<void> {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    // In production, this would write to a secure logging service
    console.log('Security Event:', logEntry);

    // For critical events, trigger alerts
    if (event.severity === 'critical') {
      await this.triggerSecurityAlert(logEntry);
    }
  }

  private static async triggerSecurityAlert(event: any): Promise<void> {
    // Implementation would send alerts to security team
    console.error('CRITICAL SECURITY EVENT:', event);
  }
}

// Main Security Middleware
export async function securityMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get client information
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const pathname = request.nextUrl.pathname;

  try {
    // Check for suspicious patterns in URL
    if (SQLInjectionPrevention.containsSQLInjection(pathname) || 
        XSSPrevention.containsXSS(pathname)) {
      
      await SecurityAuditLogger.logSecurityEvent({
        type: 'suspicious_activity',
        ipAddress: clientIP,
        userAgent,
        details: { pathname, reason: 'Malicious patterns in URL' },
        severity: 'high'
      });

      return new NextResponse('Forbidden', { status: 403 });
    }

    // Validate request body for POST/PUT requests
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const body = await request.clone().json();
        
        // Check for XSS in request body
        const bodyString = JSON.stringify(body);
        if (XSSPrevention.containsXSS(bodyString)) {
          await SecurityAuditLogger.logSecurityEvent({
            type: 'xss_attempt',
            ipAddress: clientIP,
            userAgent,
            details: { pathname, body },
            severity: 'high'
          });

          return new NextResponse('Bad Request', { status: 400 });
        }

        // Check for SQL injection in request body
        if (SQLInjectionPrevention.containsSQLInjection(bodyString)) {
          await SecurityAuditLogger.logSecurityEvent({
            type: 'sql_injection_attempt',
            ipAddress: clientIP,
            userAgent,
            details: { pathname, body },
            severity: 'critical'
          });

          return new NextResponse('Bad Request', { status: 400 });
        }

      } catch (error) {
        // Invalid JSON, continue
      }
    }

    // CSRF Protection for state-changing operations
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      const session = await getServerSession(authOptions);
      
      if (session && (!csrfToken || !CSRFProtection.validateToken(csrfToken, session.user.id))) {
        await SecurityAuditLogger.logSecurityEvent({
          type: 'csrf_violation',
          userId: session?.user.id,
          ipAddress: clientIP,
          userAgent,
          details: { pathname, method: request.method },
          severity: 'medium'
        });

        return new NextResponse('CSRF token invalid', { status: 403 });
      }
    }

    return response;

  } catch (error) {
    console.error('Security middleware error:', error);
    return response;
  }
}

// Biometric Authentication Helper
export class BiometricAuth {
  static async verifyFingerprint(fingerprintData: string, userId: string): Promise<boolean> {
    // In a real implementation, this would verify against stored biometric data
    // For now, return a mock verification
    return fingerprintData.length > 0 && userId.length > 0;
  }

  static async verifyFaceID(faceData: string, userId: string): Promise<boolean> {
    // In a real implementation, this would use face recognition APIs
    return faceData.length > 0 && userId.length > 0;
  }

  static async storeBiometricData(userId: string, biometricType: 'fingerprint' | 'face', data: string): Promise<boolean> {
    // In a real implementation, this would securely store biometric templates
    console.log(`Storing ${biometricType} data for user ${userId}`);
    return true;
  }
}

// Device Fingerprinting
export class DeviceFingerprinting {
  static generateDeviceFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const ip = request.ip || request.headers.get('x-forwarded-for') || '';
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${userAgent}${acceptLanguage}${acceptEncoding}${ip}`)
      .digest('hex');
    
    return fingerprint;
  }

  static async isKnownDevice(fingerprint: string, userId: string): Promise<boolean> {
    // In a real implementation, this would check against stored device fingerprints
    return false;
  }

  static async registerDevice(fingerprint: string, userId: string, deviceInfo: any): Promise<void> {
    // In a real implementation, this would store the device fingerprint
    console.log(`Registering device ${fingerprint} for user ${userId}`);
  }
}
