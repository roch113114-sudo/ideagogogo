// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'client' | 'developer' | 'admin';
  createdAt: Date;
}

// Requirement types
export type RequirementType = 'enterprise' | 'innovation';
export type RequirementStatus = 'open' | 'in_progress' | 'completed' | 'closed';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  budget?: number;
  deadline?: Date;
}

// Application types
export type ApplicationType = 'quote' | 'partnership';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  requirementId: string;
  requirementTitle: string;
  developerId: string;
  developerName: string;
  developerPhone: string;
  type: ApplicationType;
  status: ApplicationStatus;
  price?: number;
  duration?: number;
  questions: string;
  message?: string;
  createdAt: Date;
}

// Stats
export interface PlatformStats {
  totalRequirements: number;
  totalApplications: number;
  totalUsers: number;
  successRate: number;
}

// Form data
export interface RequirementFormData {
  title: string;
  description: string;
  type: RequirementType;
  tags: string[];
  budget?: number;
  deadline?: string;
}

export interface ApplicationFormData {
  type: ApplicationType;
  price?: number;
  duration?: number;
  questions: string;
  message?: string;
}

export type UserRole = 'client' | 'developer';

export interface UserRegisterData {
  name: string;
  phone: string;
  role?: UserRole;
}
