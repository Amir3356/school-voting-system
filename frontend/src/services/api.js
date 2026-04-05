import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Elections
export const getElections = () => api.get('/elections');
export const getElectionById = (id) => api.get(`/elections/${id}`);
export const createElection = (data) => api.post('/elections', data);
export const updateElection = (id, data) => api.put(`/elections/${id}`, data);
export const updateElectionStatus = (id, status) => api.patch(`/elections/${id}/status`, { status });
export const deleteElection = (id) => api.delete(`/elections/${id}`);

// Candidates
export const getCandidatesByElection = (electionId) => api.get(`/candidates/election/${electionId}`);
export const createCandidate = (formData) => api.post('/candidates', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const updateCandidate = (id, formData) => api.put(`/candidates/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// Votes
export const castVote = (data) => api.post('/votes', data);
export const checkVoteStatus = (electionId) => api.get(`/votes/status/${electionId}`);
export const getResults = (electionId) => api.get(`/votes/results/${electionId}`);

// Users
export const getUsers = () => api.get('/users');
export const getStudentStats = () => api.get('/users/stats');
export const toggleUserStatus = (id, status) => api.patch(`/users/${id}/status`, { status });
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
