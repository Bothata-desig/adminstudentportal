
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT'
}

export interface Student {
  id: string;
  uniqueCode: string; // The code the parent enters to link the child
  name: string;
  grade: string;
  avatar: string;
  performance: PerformanceData[];
  subjects: { name: string; score: number; weight: number }[];
  comments: string[];
  attendance: number; // percentage
  parentId?: string;
}

export interface PerformanceData {
  month: string;
  averageScore: number;
  percentile: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  studentId?: string; // Linked student ID for parents
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  roadmap: string[];
  limitBreakerAdvice: string;
  statisticalProbability: string;
}

export interface StudyTool {
  id: string;
  title: string;
  description: string;
  category: 'COGNITIVE' | 'ACADEMIC' | 'STRATEGIC';
  complexity: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}
