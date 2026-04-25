import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { electionService } from '../../services/electionService';
import { candidateService } from '../../services/candidateService';
import { voteService } from '../../services/voteService';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';

export default function Vote() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [electionId]);

  const loadData = async () => {
    try {
      const [electionRes, candidatesRes, votedRes] = await Promise.all([
        electionService.getById(electionId),
        candidateService.getAll(electionId),
        voteService.checkVoted(electionId)
      ]);
      setElection(electionRes.data);
      setCandidates(Array.isArray(candidatesRes.data) ? candidatesRes.data : []);
      setHasVoted(votedRes.data?.has_voted ?? false);
    } catch (err) {
      setError('Failed to load election data.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    setVoting(true);
    setError('');
    try {
      await voteService.castVote({
        election_id: electionId,
        candidate_id: selectedCandidate.id
      });
      setShowConfirm(false);
      setVoteSuccess(true);
    } catch (err) {
      setError(err?.message || 'Failed to cast vote. Please try again.');
      setShowConfirm(false);
    } finally {
      setVoting(false);
    }
  };

  // Loading shimmer
  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mb-8 animate-pulse"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Already voted state
  if (hasVoted) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-md p-12 max-w-md mx-auto">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Voted</h2>
          <p className="text-gray-500 mb-6">You have already cast your vote in this election.</p>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );

  // Vote success state
  if (voteSuccess) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-md p-12 max-w-md mx-auto">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vote Cast Successfully!</h2>
          <p className="text-gray-500 mb-2">You voted for <strong>{selectedCandidate?.name}</strong>.</p>
          <p className="text-gray-400 text-sm mb-6">A confirmation email has been sent to you.</p>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{election?.title}</h1>
          <p className="text-gray-500 mt-1">{election?.description}</p>
          <p className="text-sm text-gray-400 mt-1">
            📅 Ends: {new Date(election?.end_date).toLocaleDateString()}
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">Select a candidate to vote for:</p>

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => {
            const isSelected = selectedCandidate?.id === candidate.id;
            return (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                }`}
              >
                {/* Photo */}
                <div className="flex justify-center pt-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow">
                    {candidate.photo_url ? (
                      <img src={candidate.photo_url} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                      candidate.name.charAt(0)
                    )}
                  </div>
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{candidate.position}</p>
                  <p className="text-xs text-gray-400 mb-3">Grade {candidate.grade} — Section {candidate.section}</p>
                  {candidate.bio && (
                    <p className="text-sm text-gray-600 line-clamp-3">{candidate.bio}</p>
                  )}

                  {isSelected && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vote Button */}
        {selectedCandidate && (
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={() => setShowConfirm(true)}>
              Cast Vote for {selectedCandidate.name}
            </Button>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">🗳️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Your Vote</h3>
            <p className="text-gray-600 mb-1">You are voting for:</p>
            <p className="text-lg font-bold text-blue-600 mb-1">{selectedCandidate?.name}</p>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)} disabled={voting}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleVote} disabled={voting}>
                {voting ? 'Submitting...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
