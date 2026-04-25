'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/dashboard" className="text-2xl font-bold text-blue-600">
              School Voting System
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </a>
            <a href="/candidates" className="text-gray-700 hover:text-blue-600 font-medium">
              Candidates
            </a>
            <a href="/vote" className="text-gray-700 hover:text-blue-600 font-medium">
              Vote
            </a>
            <a href="/results" className="text-gray-700 hover:text-blue-600 font-medium">
              Results
            </a>
            
            <div className="flex items-center space-x-4 border-l pl-6">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
