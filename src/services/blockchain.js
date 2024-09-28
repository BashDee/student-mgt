// src/services/blockchain.js
import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Replace with your server URL if it's different

export const addStudent = async (id, name) => {
  try {
    const response = await axios.post(`${API_URL}/addStudent`, { id, name });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add student');
  }
};

export const updateGrade = async (id, course, grade) => {
  try {
    const response = await axios.post(`${API_URL}/updateGrade`, { id, course, grade });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update grade');
  }
};

export const queryStudent = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/queryStudent/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch student');
  }
};
