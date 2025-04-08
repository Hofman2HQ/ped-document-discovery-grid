
import axios from 'axios';
import { Execution } from '../types';

const API_URL = 'http://localhost:3000/api';

// Get all executions
export const getAllExecutions = async (): Promise<Execution[]> => {
  try {
    const response = await axios.get(`${API_URL}/executions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching executions:", error);
    // Return fallback mock data if API fails
    const mockExecutions = [
      {
        id: 1,
        queryId: 1,
        startDate: new Date('2023-11-05T08:30:00Z'),
        endDate: new Date('2023-11-05T09:15:23Z'),
        isCompleted: true,
        foundDocuments: 15,
        query: "nederland id card"
      },
      {
        id: 2,
        queryId: 2,
        startDate: new Date('2023-11-10T13:20:10Z'),
        endDate: new Date('2023-11-10T14:05:45Z'),
        isCompleted: true,
        foundDocuments: 8,
        query: "Israel Driver license"
      },
      {
        id: 3,
        queryId: 3,
        startDate: new Date('2023-11-15T16:45:22Z'),
        endDate: new Date('2023-11-15T17:30:11Z'),
        isCompleted: true,
        foundDocuments: 12,
        query: "Algeria Id Card"
      },
      {
        id: 4,
        queryId: 4,
        startDate: new Date('2023-12-01T09:10:30Z'),
        endDate: null,
        isCompleted: false,
        foundDocuments: 0,
        query: "United Kingdom Passport"
      },
      {
        id: 5,
        queryId: 5,
        startDate: new Date('2023-12-05T11:25:15Z'),
        endDate: new Date('2023-12-05T12:10:50Z'),
        isCompleted: true,
        foundDocuments: 5,
        query: "France National ID"
      }
    ];
    return mockExecutions;
  }
};

// Get execution by ID
export const getExecutionById = async (id: number): Promise<Execution> => {
  try {
    const response = await axios.get(`${API_URL}/executions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching execution by ID:", error);
    throw error;
  }
};

// Get executions for a specific query
export const getExecutionsByQueryId = async (queryId: number): Promise<Execution[]> => {
  try {
    const response = await axios.get(`${API_URL}/executions/query/${queryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching executions by query ID:", error);
    throw error;
  }
};
