'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CandidateCard from '@/components/CandidateCard';
import { candidates, elections } from '@/lib/api';

export default function Candidates() {
  const router = useRouter();
  const [candidatesList, setCandidatesList] = useState([]);
  const [activeElection, setActiveElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const election = await elections.getActive();
      setActiveElection(election);

      if (election) {
        const data = await candidates.getAll(election.id);
        setCandidatesList(data);
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidates</h1>

        {activeElection ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h2 className="text-xl font-semibold text-blue-900">{activeElection.title}</h2>
              <p className="text-blue-700">{activeElection.description}</p>
            </div>

            {candidatesList.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidatesList.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No candidates available yet</p>
              </div>
            )}
          </>
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
