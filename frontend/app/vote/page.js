'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CandidateCard from '@/components/CandidateCard';
import { candidates, elections, votes } from '@/lib/api';

export default function Vote() {
  const router = useRouter();
  const [candidatesList, setCandidatesList] = useState([]);
  const [activeElection, setActiveElection] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

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

        const voteStatus = await votes.hasVoted(election.id);
        setHasVoted(voteStatus.has_voted);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId) => {
    if (hasVoted || !activeElection) return;

    const confirmed = confirm('Are you sure you want to vote for this candidate? This action cannot be undone.');
    if (!confirmed) return;

    setVoting(true);
    try {
      await votes.submit({
        candidate_id: candidateId,
        election_id: activeElection.id,
      });

      alert('Vote submitted successfully! Check your email for confirmation.');
      setHasVoted(true);
      router.push('/results');
    } catch (err) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setVoting(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cast Your Vote</h1>

        {hasVoted && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">✓ You have already voted in this election</p>
          </div>
        )}

        {activeElection ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h2 className="text-xl font-semibold text-blue-900">{activeElection.title}</h2>
              <p className="text-blue-700">{activeElection.description}</p>
            </div>

            {candidatesList.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidatesList.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onVote={handleVote}
                    hasVoted={hasVoted || voting}
                  />
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
