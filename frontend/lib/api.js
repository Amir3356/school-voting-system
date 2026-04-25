const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const auth = {
  register: (data) => apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  login: (data) => apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  logout: () => apiRequest('/logout', { method: 'POST' }),
  
  me: () => apiRequest('/me'),
};

export const elections = {
  getAll: () => apiRequest('/elections'),
  getActive: () => apiRequest('/elections/active'),
  getById: (id) => apiRequest(`/elections/${id}`),
  create: (data) => apiRequest('/elections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/elections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/elections/${id}`, { method: 'DELETE' }),
};

export const candidates = {
  getAll: (electionId) => apiRequest(`/candidates${electionId ? `?election_id=${electionId}` : ''}`),
  getById: (id) => apiRequest(`/candidates/${id}`),
  create: (data) => apiRequest('/candidates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/candidates/${id}`, { method: 'DELETE' }),
};

export const votes = {
  submit: (data) => apiRequest('/vote', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  hasVoted: (electionId) => apiRequest(`/vote/check/${electionId}`),
};

export const results = {
  get: (electionId) => apiRequest(`/results?election_id=${electionId}`),
  statistics: () => apiRequest('/statistics'),
};
