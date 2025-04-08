
import { Execution } from '@/types';

// Mock data for executions
const mockExecutions: Execution[] = [
  {
    id: 1,
    queryId: 101,
    startDate: new Date('2025-03-01T10:00:00'),
    endDate: new Date('2025-03-01T10:30:45'),
    isCompleted: true,
    foundDocuments: 128,
    query: 'passport california'
  },
  {
    id: 2,
    queryId: 102,
    startDate: new Date('2025-03-05T14:20:00'),
    endDate: new Date('2025-03-05T14:45:12'),
    isCompleted: true,
    foundDocuments: 85,
    query: 'drivers license florida'
  },
  {
    id: 3,
    queryId: 103,
    startDate: new Date('2025-03-10T09:15:00'),
    endDate: null,
    isCompleted: false,
    foundDocuments: 43,
    query: 'birth certificate texas'
  },
  {
    id: 4,
    queryId: 104,
    startDate: new Date('2025-03-15T16:30:00'),
    endDate: new Date('2025-03-15T17:05:22'),
    isCompleted: true,
    foundDocuments: 156,
    query: 'social security card new york'
  },
  {
    id: 5,
    queryId: 105,
    startDate: new Date('2025-03-20T11:45:00'),
    endDate: null,
    isCompleted: false,
    foundDocuments: 31,
    query: 'visa documents california'
  }
];

export const fetchExecutions = async (): Promise<Execution[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExecutions);
    }, 800);
  });
};
