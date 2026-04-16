import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getStudentStats, checkVoteStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Vote, Clock, CheckCircle, Calendar, Timer, FileText } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [stats, setStats] = useState(null);
  const [votedElections, setVotedElections] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [electionsRes, statsRes] = await Promise.all([
        getElections(),
        getStudentStats()
      ]);

      setElections(electionsRes.data);
      setStats(statsRes.data);

      // Check vote status for each election
      const voteStatuses = await Promise.all(
        electionsRes.data.map(election => 
          checkVoteStatus(election.id).catch(() => ({ data: { hasVoted: false } }))
        )
      );

      const votedSet = new Set();
      electionsRes.data.forEach((election, index) => {
        if (voteStatuses[index]?.data?.hasVoted) {
          votedSet.add(election.id);
        }
      });
      setVotedElections(votedSet);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return null;
    
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-lg font-semibold text-muted-foreground">View and participate in school elections</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/student/reports')}>
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Statistics Cards */}
            {stats && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-muted-foreground mb-1">Total Elections</p>
                        <p className="text-4xl font-extrabold">{stats.totalElections}</p>
                      </div>
                      <Vote className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-muted-foreground mb-1">Votes Cast</p>
                        <p className="text-4xl font-extrabold">{stats.votedElections}</p>
                      </div>
                      <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-muted-foreground mb-1">Active Elections</p>
                        <p className="text-4xl font-extrabold">{stats.activeElections}</p>
                      </div>
                      <Clock className="w-12 h-12 text-orange-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Elections Grid */}
            {elections.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Vote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No elections available at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex justify-center items-center w-full">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-7xl mx-auto">
                {elections.map((election) => {
                  const now = new Date();
                  const votingNotStarted = election.start_time && new Date(election.start_time) > now;
                  const votingEnded = election.end_time && new Date(election.end_time) <= now;
                  const isVotingActive = election.status === 'open' && !votingNotStarted && !votingEnded;
                  const hasVoted = votedElections.has(election.id);
                  const timeRemaining = isVotingActive ? getTimeRemaining(election.end_time) : null;
                  
                  return (
                    <Card key={election.id} className="hover:shadow-lg transition-shadow relative">
                      {/* Voted Badge */}
                      {hasVoted && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
                            <CheckCircle className="w-3 h-3" />
                            Voted
                          </span>
                        </div>
                      )}
                      
                      <CardHeader className="text-center" style={{ paddingTop: hasVoted ? '3.5rem' : '1.5rem' }}>
                        <div className="flex flex-col items-center justify-center mb-2">
                          {isVotingActive ? (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full flex items-center mb-3">
                              <Clock className="w-4 h-4 mr-1" />
                              Open
                            </span>
                          ) : votingNotStarted ? (
                            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full flex items-center mb-3">
                              <Clock className="w-4 h-4 mr-1" />
                              Upcoming
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-full flex items-center mb-3">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Closed
                            </span>
                          )}
                          <CardTitle className="text-2xl font-extrabold">{election.title}</CardTitle>
                        </div>
                        <CardDescription className="text-center text-base font-semibold">{election.description}</CardDescription>
                        
                        {/* Countdown Timer */}
                        {timeRemaining && (
                          <div className="mt-3 flex items-center justify-center gap-2 text-base bg-orange-50 px-4 py-2.5 rounded-lg mx-auto">
                            <Timer className="w-5 h-5 text-orange-600" />
                            <span className="font-bold text-orange-900">{timeRemaining}</span>
                          </div>
                        )}
                        
                        {/* Election Time Information */}
                        <div className="mt-3 space-y-1.5 text-sm flex flex-col items-center">
                          {election.start_time && (
                            <div className="flex items-center gap-1.5 text-blue-600">
                              <Calendar className="w-4 h-4" />
                              <span className="font-semibold">Start: {new Date(election.start_time).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                          {election.end_time && (
                            <div className="flex items-center gap-1.5 text-red-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">End: {new Date(election.end_time).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {votingNotStarted ? (
                            <Button 
                              variant="outline" 
                              className="w-full text-base font-bold py-5"
                              disabled
                            >
                              Voting Not Started
                            </Button>
                          ) : isVotingActive ? (
                            hasVoted ? (
                              <Button 
                                variant="outline" 
                                className="w-full text-base font-bold py-5"
                                onClick={() => navigate(`/student/results/${election.id}`)}
                              >
                                View Results
                              </Button>
                            ) : (
                              <Button 
                                className="w-full text-base font-bold py-5" 
                                onClick={() => navigate(`/student/vote/${election.id}`)}
                              >
                                Vote Now
                              </Button>
                            )
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full text-base font-bold py-5"
                              onClick={() => navigate(`/student/results/${election.id}`)}
                            >
                              View Results
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
