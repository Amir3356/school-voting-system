import api from './api';

export const candidateService = {
  getAll: (electionId) => api.get('/candidates', { params: { election_id: electionId } }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`)
};
