'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { results, elections } from '@/lib/api';

export default function Results() {
  const router = useRouter();
  const [electionResults, setElectionResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const election = await elections.getActive();
      if (election) {
        const data = await results.get(election.id);
        setElectionResults(data);
      }
    } catch (err) {
      console.error('Error loading results:', err);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Election Results</h1>

        {electionResults ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{electionResults.election.title}</h2>
              <p className="text-gray-600 mb-4">{electionResults.election.description}</p>
              <p className="text-lg font-semibold text-blue-600">
                Total Votes: {electionResults.total_votes}
              </p>
            </div>

            <div className="space-y-4">
              {electionResults.results.map((candidate, index) => (
                <div key={candidate.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                        <p className="text-blue-600 font-semibold">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{candidate.vote_count}</div>
                      <div className="text-gray-600">votes</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all"
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-2 text-gray-600 font-semibold">
                    {candidate.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Available</h2>
            <p className="text-gray-600">Results will be available once voting begins</p>
          </div>
        )}
      </main>
    </div>
  );
}
