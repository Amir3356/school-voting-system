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
export const updateElectionStatus = (id, status) => api.patch(`/elections/${id}/status`, { status });
export const deleteElection = (id) => api.delete(`/elections/${id}`);

// Candidates
export const getCandidatesByElection = (electionId) => api.get(`/candidates/election/${electionId}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// Votes
export const castVote = (data) => api.post('/votes', data);
export const checkVoteStatus = (electionId) => api.get(`/votes/status/${electionId}`);
export const getResults = (electionId) => api.get(`/votes/results/${electionId}`);

// Users
export const getUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
