import api from './api';

export const authService = {
  register: (data) => api.post('/register', data),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getMe: () => api.get('/me')
};
