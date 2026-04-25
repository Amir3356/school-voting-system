export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
};

export const ELECTION_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  ENDED: 'ended'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_VOTE: '/student/vote',
  STUDENT_RESULTS: '/student/results',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ELECTIONS: '/admin/elections',
  ADMIN_CANDIDATES: '/admin/candidates',
  ADMIN_VOTERS: '/admin/voters'
};
