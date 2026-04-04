import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidatesByElection, castVote, checkVoteStatus, getElectionById } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, User } from 'lucide-react';

export default function Vote() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);
    try {
      await castVote({
        candidate_id: selectedCandidate,
        election_id: electionId
      });
      
      alert('Vote cast successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cast vote');
    } finally {
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
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{election?.title}</h1>
          <p className="text-muted-foreground">{election?.description}</p>
        </div>

        <div className="grid gap-4 mb-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={`cursor-pointer transition-all ${
                selectedCandidate === candidate.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
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
                  {selectedCandidate === candidate.id && (
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
            Cancel
          </Button>
          <Button
            onClick={handleVote}
            disabled={!selectedCandidate || submitting}
            className="flex-1"
          >
            {submitting ? 'Submitting...' : 'Cast Vote'}
          </Button>
        </div>
      </div>
    </div>
  );
}
