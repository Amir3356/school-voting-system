import api from './api';

export const voteService = {
  castVote: (data) => api.post('/votes', data),
  getMyVotes: () => api.get('/votes/my-votes'),
  checkVoted: (electionId) => api.get(`/votes/check/${electionId}`),
  getResults: (electionId) => api.get(`/votes/results/${electionId}`)
};
