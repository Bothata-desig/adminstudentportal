
import { Student, UserRole, User, StudyTool } from './types';

export const MOCK_STUDENTS: Student[] = [];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'System Admin', role: UserRole.ADMIN, email: 'admin@sello.edu' },
  { id: 'u2', name: 'Class Teacher', role: UserRole.TEACHER, email: 'teacher@sello.edu' },
  { id: 'u3', name: 'Primary Caretaker', role: UserRole.PARENT, email: 'parent@sello.edu' },
];

export const MOCK_TOOLS: StudyTool[] = [
  {
    id: 't1',
    title: 'Cognitive Load Optimizer',
    description: 'Advanced scheduling algorithm based on spacing and interleaving effects to maximize retention.',
    category: 'COGNITIVE',
    complexity: 'ADVANCED'
  },
  {
    id: 't2',
    title: 'Logic Synthesis Engine',
    description: 'Framework for building complex argument structures and identifying logical fallacies in research.',
    category: 'ACADEMIC',
    complexity: 'INTERMEDIATE'
  },
  {
    id: 't3',
    title: 'Deep Work Monitor',
    description: 'Analytics-driven approach to tracking focus duration and productivity cycles.',
    category: 'STRATEGIC',
    complexity: 'ADVANCED'
  },
  {
    id: 't4',
    title: 'Predictive Grade Modeller',
    description: 'Statistical engine to simulate potential academic outcomes based on current effort levels.',
    category: 'ACADEMIC',
    complexity: 'BASIC'
  }
];
