
import axios from 'axios';
import { PedCollectorQuery } from '../types';

const API_URL = 'http://localhost:3000/api';

// Get all queries
export const getAllQueries = async (): Promise<PedCollectorQuery[]> => {
  const response = await axios.get(`${API_URL}/collector-queries`);
  return response.data;
};

// Get query by ID
export const getQueryById = async (id: number): Promise<PedCollectorQuery> => {
  const response = await axios.get(`${API_URL}/collector-queries/${id}`);
  return response.data;
};

// Create new query
export const createQuery = async (queryText: string): Promise<PedCollectorQuery> => {
  const response = await axios.post(`${API_URL}/collector-queries`, { query: queryText });
  return response.data;
};

// Update query
export const updateQuery = async (id: number, queryText: string): Promise<PedCollectorQuery> => {
  const response = await axios.put(`${API_URL}/collector-queries/${id}`, { query: queryText });
  return response.data;
};

// Delete query
export const deleteQuery = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/collector-queries/${id}`);
};

// Execute query
export const executeQuery = async (id: number): Promise<{ message: string, queryId: number, executedAt: Date }> => {
  const response = await axios.post(`${API_URL}/collector-queries/${id}/execute`);
  return response.data;
};
