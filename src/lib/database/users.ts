// User database operations
// This is a placeholder implementation - replace with your actual database

import { User } from '@/types/user';

// Mock user data for development
const mockUsers: (User & { passwordHash: string; hasProfile: boolean })[] = [
  {
    id: '1',
    email: 'demo@example.com',
    passwordHash: '$2a$10$example', // This would be a real bcrypt hash
    isVerified: true,
    emailVerified: true,
    phoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    hasProfile: true,
  }
];

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string; hasProfile: boolean }) | null> {
  // In a real implementation, this would query your database
  const user = mockUsers.find(u => u.email === email);
  return user || null;
}

export async function getUserById(id: string): Promise<(User & { hasProfile: boolean; subscription?: any }) | null> {
  // In a real implementation, this would query your database
  const user = mockUsers.find(u => u.id === id);
  if (!user) return null;
  
  return {
    ...user,
    hasProfile: user.hasProfile,
    subscription: {
      planId: 'free',
      isActive: true,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }
  };
}

export async function createUser(userData: {
  email: string;
  passwordHash: string;
  phone?: string;
}): Promise<User> {
  // In a real implementation, this would insert into your database
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    phone: userData.phone,
    isVerified: false,
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
  };
  
  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  // In a real implementation, this would update your database
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date() };
  return mockUsers[userIndex];
}

export async function verifyUserEmail(id: string): Promise<void> {
  // In a real implementation, this would update the email verification status
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    mockUsers[userIndex].emailVerified = true;
    mockUsers[userIndex].isVerified = true;
  }
}

export async function verifyUserPhone(id: string): Promise<void> {
  // In a real implementation, this would update the phone verification status
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    mockUsers[userIndex].phoneVerified = true;
  }
}
