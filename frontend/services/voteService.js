import { api } from './api';

export const voteService = {
  async castVote(voteData) {
    return await api.request('/vote', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  },

  async getResults(electionId) {
    return await api.request(`/results/${electionId}`);
  },

  async getMyVotes() {
    return await api.request('/my-votes');
  },

  async getCandidates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.request(`/candidates${queryString ? `?${queryString}` : ''}`);
  },

  async getCandidate(id) {
    return await api.request(`/candidates/${id}`);
  },
};
