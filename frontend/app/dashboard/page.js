'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { elections, results } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const election = await elections.getActive();
      setActiveElection(election);

      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.role === 'admin') {
        const statistics = await results.statistics();
        setStats(statistics);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Student ID: {user?.student_id}</p>
        </div>

        {user?.role === 'admin' && stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.total_elections}</div>
              <div className="text-gray-600 mt-2">Total Elections</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600">{stats.active_elections}</div>
              <div className="text-gray-600 mt-2">Active Elections</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600">{stats.total_votes}</div>
              <div className="text-gray-600 mt-2">Total Votes</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600">{stats.total_candidates}</div>
              <div className="text-gray-600 mt-2">Total Candidates</div>
            </div>
          </div>
        )}

        {activeElection ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Election</h2>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{activeElection.title}</h3>
            <p className="text-gray-600 mb-4">{activeElection.description}</p>
            <div className="flex space-x-4">
              <a
                href="/vote"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Cast Your Vote
              </a>
              <a
                href="/candidates"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View Candidates
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Elections</h2>
            <p className="text-gray-600">Check back later for upcoming elections</p>
          </div>
        )}
      </main>
    </div>
  );
}
