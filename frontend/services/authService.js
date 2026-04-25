import { api } from './api';

export const authService = {
  async register(userData) {
    const data = await api.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async login(credentials) {
    const data = await api.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async logout() {
    try {
      await api.request('/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    return await api.request('/me');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
