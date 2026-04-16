import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import StudentDashboard from '../pages/student/Dashboard';
import Vote from '../pages/student/Vote';
import Results from '../pages/student/Results';
import StudentReports from '../pages/student/Reports';
import AdminDashboard from '../pages/admin/Dashboard';
import Elections from '../pages/admin/Elections';
import Candidates from '../pages/admin/Candidates';
import Users from '../pages/admin/Users';
import Analytics from '../pages/admin/Analytics';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/vote/:electionId" element={
          <ProtectedRoute allowedRole="student">
            <Vote />
          </ProtectedRoute>
        } />
        <Route path="/student/results/:electionId" element={
          <ProtectedRoute allowedRole="student">
            <Results />
          </ProtectedRoute>
        } />
        <Route path="/student/reports" element={
          <ProtectedRoute allowedRole="student">
            <StudentReports />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/elections" element={
          <ProtectedRoute allowedRole="admin">
            <Elections />
          </ProtectedRoute>
        } />
        <Route path="/admin/candidates" element={
          <ProtectedRoute allowedRole="admin">
            <Candidates />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRole="admin">
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRole="admin">
            <Analytics />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
