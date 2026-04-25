import api from './api';

export const candidateService = {
  getAll: (electionId) => api.get('/candidates', { params: { election_id: electionId } }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/candidates', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  update: (id, data) => {
    const isFormData = data instanceof FormData;
    return api.post(`/candidates/${id}?_method=PUT`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  delete: (id) => api.delete(`/candidates/${id}`)
};
