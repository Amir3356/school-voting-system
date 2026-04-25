import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { electionService } from '../../services/electionService';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const response = await electionService.getActive();
      const data = Array.isArray(response.data) ? response.data : [];
      setElections(data);
    } catch (error) {
      console.error('Failed to load elections', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Ended';
    if (days === 0) return 'Ends today';
    return `${days} day${days > 1 ? 's' : ''} left`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow-md">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name} 👋</h1>
          <p className="text-blue-100 text-sm">Cast your vote and make your voice heard.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Active Elections</p>
            <p className="text-3xl font-bold text-blue-600">{elections.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Your Grade</p>
            <p className="text-3xl font-bold text-green-600">{user?.grade ?? '—'}</p>
          </div>
        </div>

        {/* Elections */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Elections</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : elections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-4xl mb-3">🗳️</p>
            <p className="text-gray-600 font-medium">No active elections at the moment.</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for upcoming elections.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{election.title}</h3>
                  <span className="inline-block mt-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    🟢 Active
                  </span>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4">
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {election.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>📅 Ends: {new Date(election.end_date).toLocaleDateString()}</span>
                    <span className="font-medium text-orange-500">{getDaysLeft(election.end_date)}</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    👥 {election.candidates?.length ?? 0} candidate{election.candidates?.length !== 1 ? 's' : ''}
                  </div>

                  <Link to={`/student/vote/${election.id}`}>
                    <Button className="w-full">Vote Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
