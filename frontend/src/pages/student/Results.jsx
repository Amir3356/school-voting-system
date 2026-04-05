import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResults, getElectionById } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Calendar, Clock } from 'lucide-react';

export default function Results() {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [electionId]);

  const fetchResults = async () => {
    try {
      const [electionRes, resultsRes] = await Promise.all([
        getElectionById(electionId),
        getResults(electionId)
      ]);

      setElection(electionRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">Loading results...</div>
      </div>
    );
  }

  const winner = results.length > 0 ? results[0] : null;
  const totalVotes = results.reduce((sum, r) => sum + parseInt(r.vote_count), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{election?.title} - Results</h1>
          <p className="text-muted-foreground mb-4">Total Votes: {totalVotes}</p>
          
          {/* Election Time Information */}
          <div className="flex flex-wrap gap-4">
            {election?.start_time && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Started:</span>
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
                <span className="font-medium text-red-900">Ended:</span>
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
        </div>

        {winner && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Trophy className="w-12 h-12 text-yellow-500" />
                <div>
                  <h2 className="text-2xl font-bold">{winner.name}</h2>
                  <p className="text-muted-foreground">{winner.position}</p>
                  <p className="text-lg font-semibold text-yellow-700">
                    Winner with {winner.vote_count} votes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vote_count" fill="#3b82f6" name="Votes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((candidate, index) => (
                <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{candidate.vote_count}</p>
                    <p className="text-sm text-muted-foreground">
                      {totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
