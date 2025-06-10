// Authentication utilities and configuration

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { User } from '@/types/user';

// Database connection (you'll need to implement this based on your database choice)
import { getUserByEmail, getUserById } from '@/lib/database/users';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const user = await getUserByEmail(credentials.email);
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await compare(credentials.password, user.passwordHash);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          if (!user.isVerified) {
            throw new Error('Please verify your email before logging in');
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.profilePhotoUrl,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      // Handle Google OAuth
      if (account?.provider === 'google') {
        try {
          let dbUser = await getUserByEmail(user.email!);
          
          if (!dbUser) {
            // Create new user from Google OAuth
            dbUser = await createUserFromOAuth({
              email: user.email!,
              name: user.name!,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
            });
          }
          
          token.id = dbUser.id;
        } catch (error) {
          console.error('OAuth user creation error:', error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        
        // Fetch additional user data
        try {
          const user = await getUserById(token.id as string);
          if (user) {
            session.user.isVerified = user.isVerified;
            session.user.hasProfile = user.hasProfile;
          }
        } catch (error) {
          console.error('Session callback error:', error);
        }
      }
      
      return session;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to create user from OAuth
async function createUserFromOAuth(data: {
  email: string;
  name: string;
  image?: string | null;
  provider: string;
  providerId: string;
}) {
  // This would be implemented based on your database
  // For now, returning a mock user
  return {
    id: 'oauth-user-id',
    email: data.email,
    firstName: data.name.split(' ')[0],
    lastName: data.name.split(' ').slice(1).join(' '),
    profilePhotoUrl: data.image,
    isVerified: true, // OAuth users are considered verified
    hasProfile: false,
  };
}

// Password validation utility
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Email validation utility
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation utility (Indian phone numbers)
export function validateIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// JWT token utilities for custom authentication
export async function generateAccessToken(userId: string): Promise<string> {
  const jwt = require('jsonwebtoken');
  
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const jwt = require('jsonwebtoken');
  
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
}

export async function verifyAccessToken(token: string): Promise<{ userId: string } | null> {
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (decoded.type === 'access') {
      return { userId: decoded.userId };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Middleware for protecting API routes
export function withAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const decoded = await verifyAccessToken(token);
      
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      req.userId = decoded.userId;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = new Date();
  const attempts = authAttempts.get(identifier);
  
  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if window has passed
  if (now.getTime() - attempts.lastAttempt.getTime() > windowMs) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if limit exceeded
  if (attempts.count >= maxAttempts) {
    return false;
  }
  
  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;
  authAttempts.set(identifier, attempts);
  
  return true;
}

// Session management utilities
export interface SessionData {
  userId: string;
  email: string;
  isVerified: boolean;
  hasProfile: boolean;
  subscription?: {
    planId: string;
    isActive: boolean;
    endDate: Date;
  };
}

export async function getSessionData(userId: string): Promise<SessionData | null> {
  try {
    const user = await getUserById(userId);
    if (!user) return null;
    
    return {
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
      hasProfile: user.hasProfile,
      subscription: user.subscription,
    };
  } catch (error) {
    console.error('Error fetching session data:', error);
    return null;
  }
}

// Two-factor authentication utilities
export async function generateTOTPSecret(): Promise<string> {
  const speakeasy = require('speakeasy');
  
  const secret = speakeasy.generateSecret({
    name: 'Matrimony Platform',
    length: 32,
  });
  
  return secret.base32;
}

export function verifyTOTP(token: string, secret: string): boolean {
  const speakeasy = require('speakeasy');
  
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });
}
