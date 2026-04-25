import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { electionService } from '../../services/electionService';
import { candidateService } from '../../services/candidateService';
import { voteService } from '../../services/voteService';
import { useNotification } from '../../hooks/useNotification';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import Modal from '../../components/common/Modal';

export default function Vote() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const { notification, showError, showSuccess, hideNotification } = useNotification();

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
      setCandidates(candidatesRes.data);
      setHasVoted(votedRes.data.has_voted);
    } catch (error) {
      showError('Failed to load election data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    try {
      await voteService.castVote({
        election_id: electionId,
        candidate_id: selectedCandidate.id
      });

      showSuccess('Vote cast successfully!');
      setShowConfirm(false);
      
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (error) {
      showError(error.message || 'Failed to cast vote');
    }
  };

  if (loading) return <Loader size="lg" />;

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">You have already voted in this election</h2>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{election?.title}</h1>
        <p className="text-gray-600 mb-6">{election?.description}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all ${
                selectedCandidate?.id === candidate.id ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
              <p className="text-gray-600 mb-2">Position: {candidate.position}</p>
              <p className="text-sm text-gray-500 mb-2">
                {candidate.grade} - {candidate.section}
              </p>
              {candidate.bio && <p className="text-sm">{candidate.bio}</p>}
            </div>
          ))}
        </div>

        {selectedCandidate && (
          <div className="mt-8 text-center">
            <Button onClick={() => setShowConfirm(true)} size="lg">
              Cast Vote for {selectedCandidate.name}
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Your Vote"
      >
        <p className="mb-4">
          Are you sure you want to vote for <strong>{selectedCandidate?.name}</strong>?
        </p>
        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleVote} className="flex-1">
            Confirm Vote
          </Button>
        </div>
      </Modal>
    </div>
  );
}
