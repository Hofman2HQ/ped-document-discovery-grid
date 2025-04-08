
import axios from 'axios';
import { PedCollectorQuery } from '../types';

const API_URL = 'http://localhost:3000/api';

// Get all queries
export const getAllQueries = async (): Promise<PedCollectorQuery[]> => {
  try {
    const response = await axios.get(`${API_URL}/collector-queries`);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching queries:", error);
    // Return fallback mock data if API fails
    const mockQueries = [
      {
        id: 1,
        query: "nederland id card",
        insertDatetime: "2021-11-03T14:18:54.546Z",
        updateDatetime: "2021-11-14T09:57:52.780Z"
      },
      {
        id: 2,
        query: "Israel Driver license",
        insertDatetime: "2022-07-19T07:38:10.476Z",
        updateDatetime: "2022-07-19T07:38:10.476Z"
      },
      {
        id: 3,
        query: "Algeria Id Card",
        insertDatetime: "2022-07-19T07:38:10.640Z",
        updateDatetime: "2022-07-19T07:38:10.640Z"
      },
      {
        id: 4,
        query: "United Kingdom Passport",
        insertDatetime: "2023-01-15T11:22:33.123Z",
        updateDatetime: "2023-02-20T15:30:45.987Z"
      },
      {
        id: 5,
        query: "France National ID",
        insertDatetime: "2023-05-10T08:45:12.333Z",
        updateDatetime: "2023-05-10T08:45:12.333Z"
      },
      {
        id: 6,
        query: "Germany Residence Permit",
        insertDatetime: "2023-09-22T16:30:05.777Z",
        updateDatetime: "2023-10-15T12:20:45.123Z"
      }
    ];
    return mockQueries;
  }
};

// Get query by ID
export const getQueryById = async (id: number): Promise<PedCollectorQuery> => {
  try {
    const response = await axios.get(`${API_URL}/collector-queries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching query by ID:", error);
    throw error;
  }
};

// Create new query
export const createQuery = async (queryText: string): Promise<PedCollectorQuery> => {
  try {
    const response = await axios.post(`${API_URL}/collector-queries`, { query: queryText });
    return response.data;
  } catch (error) {
    console.error("Error creating query:", error);
    throw error;
  }
};

// Update query
export const updateQuery = async (id: number, queryText: string): Promise<PedCollectorQuery> => {
  try {
    const response = await axios.put(`${API_URL}/collector-queries/${id}`, { query: queryText });
    return response.data;
  } catch (error) {
    console.error("Error updating query:", error);
    throw error;
  }
};

// Delete query
export const deleteQuery = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/collector-queries/${id}`);
  } catch (error) {
    console.error("Error deleting query:", error);
    throw error;
  }
};

// Execute query
export const executeQuery = async (id: number): Promise<{ message: string, queryId: number, executedAt: Date }> => {
  try {
    const response = await axios.post(`${API_URL}/collector-queries/${id}/execute`);
    return response.data;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
