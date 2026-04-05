import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidatesByElection, castVote, checkVoteStatus, getElectionById } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, User, Clock, Calendar } from 'lucide-react';

export default function Vote() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    fetchData();
  }, [electionId]);

  const fetchData = async () => {
    try {
      const [electionRes, candidatesRes, voteStatusRes] = await Promise.all([
        getElectionById(electionId),
        getCandidatesByElection(electionId),
        checkVoteStatus(electionId)
      ]);

      setElection(electionRes.data);
      setCandidates(candidatesRes.data);
      setHasVoted(voteStatusRes.data.hasVoted);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;

    // Check if voting is allowed based on time
    const now = new Date();
    if (election?.start_time && new Date(election.start_time) > now) {
      alert(`Voting has not started yet. It will open on ${new Date(election.start_time).toLocaleString()}`);
      return;
    }
    
    if (election?.end_time && new Date(election.end_time) <= now) {
      alert('Voting has ended. You can no longer vote in this election.');
      return;
    }

    setSubmitting(true);
    try {
      await castVote({
        candidate_id: selectedCandidate,
        election_id: electionId
      });
      
      // Show success message
      setSuccessMessage(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cast vote');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">Loading...</div>
      </div>
    );
  }

  // Check if voting is allowed based on time
  const now = new Date();
  const votingNotStarted = election?.start_time && new Date(election.start_time) > now;
  const votingEnded = election?.end_time && new Date(election.end_time) <= now;
  const canVote = !votingNotStarted && !votingEnded && !hasVoted;

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">You've Already Voted</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for participating in this election!
              </p>
              <Button onClick={() => navigate('/student/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold text-lg">Vote cast successfully!</span>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{election?.title}</h1>
          <p className="text-muted-foreground mb-4">{election?.description}</p>
          
          {/* Election Time Information */}
          <div className="flex flex-wrap gap-4 mt-4">
            {election?.start_time && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Start:</span>
                <span className="text-blue-700">
                  {new Date(election.start_time).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            
            {election?.end_time && (
              <div className="flex items-center gap-2 text-sm bg-red-50 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-900">End:</span>
                <span className="text-red-700">
                  {new Date(election.end_time).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
          
          {/* Voting Status Messages */}
          {votingNotStarted && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                ⏳ Voting has not started yet. Please come back on {new Date(election.start_time).toLocaleString()}
              </p>
            </div>
          )}
          
          {votingEnded && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                🔒 Voting has ended. You can no longer vote in this election.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-4 mb-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={`cursor-pointer transition-all ${
                selectedCandidate === candidate.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:shadow-md'
              } ${!canVote ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => canVote && setSelectedCandidate(candidate.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {candidate.photo ? (
                      <img src={candidate.photo} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{candidate.name}</h3>
                    <p className="text-muted-foreground">{candidate.position}</p>
                  </div>
                  {selectedCandidate === candidate.id && canVote && (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/student/dashboard')}
            className="flex-1"
          >
            {votingNotStarted || votingEnded ? 'Back to Dashboard' : 'Cancel'}
          </Button>
          {canVote && (
            <Button
              onClick={handleVote}
              disabled={!selectedCandidate || submitting}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Cast Vote'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
