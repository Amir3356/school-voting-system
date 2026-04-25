import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';

// Pages
import Home from './pages/shared/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import Vote from './pages/student/Vote';
import AdminDashboard from './pages/admin/Dashboard';
import Elections from './pages/admin/Elections';
import Candidates from './pages/admin/Candidates';
import Results from './pages/admin/Results';
import CreateElection from './pages/admin/CreateElection';
import CreateCandidate from './pages/admin/CreateCandidate';
import EditElection from './pages/admin/EditElection';
import EditCandidate from './pages/admin/EditCandidate';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/vote/:electionId"
            element={
              <ProtectedRoute requiredRole="student">
                <Vote />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/elections"
            element={
              <ProtectedRoute requiredRole="admin">
                <Elections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/elections/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateElection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/elections/:id/edit"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditElection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <ProtectedRoute requiredRole="admin">
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/candidates/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateCandidate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <ProtectedRoute requiredRole="admin">
                <Results />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
