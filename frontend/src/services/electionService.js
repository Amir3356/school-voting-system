import api from './api';

export const electionService = {
  getAll: () => api.get('/elections'),
  getActive: () => api.get('/elections/active'),
  getById: (id) => api.get(`/elections/${id}`),
  create: (data) => api.post('/elections', data),
  update: (id, data) => api.put(`/elections/${id}`, data),
  delete: (id) => api.delete(`/elections/${id}`)
};
