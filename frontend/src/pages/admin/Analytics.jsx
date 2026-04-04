import { useState, useEffect } from 'react';
import { getElections, getUsers, getResults } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Vote, Users, TrendingUp, Award } from 'lucide-react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalElections: 0,
    totalUsers: 0,
    openElections: 0,
    closedElections: 0
  });
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [electionResults, setElectionResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchElectionResults();
    }
  }, [selectedElection]);

  const fetchData = async () => {
    try {
      const [electionsRes, usersRes] = await Promise.all([
        getElections(),
        getUsers()
      ]);

      const electionsData = electionsRes.data;
      const usersData = usersRes.data;

      setElections(electionsData);
      if (electionsData.length > 0) {
        setSelectedElection(electionsData[0].id);
      }

      setStats({
        totalElections: electionsData.length,
        totalUsers: usersData.length,
        openElections: electionsData.filter(e => e.status === 'open').length,
        closedElections: electionsData.filter(e => e.status === 'closed').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchElectionResults = async () => {
    try {
      const response = await getResults(selectedElection);
      setElectionResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const pieData = electionResults.map((candidate, index) => ({
    name: candidate.name,
    value: parseInt(candidate.vote_count),
    color: COLORS[index % COLORS.length]
  }));

  const totalVotes = electionResults.reduce((sum, c) => sum + parseInt(c.vote_count), 0);
  const winner = electionResults.length > 0 ? electionResults[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">View voting statistics and insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Elections</p>
                  <p className="text-3xl font-bold">{stats.totalElections}</p>
                </div>
                <Vote className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Elections</p>
                  <p className="text-3xl font-bold">{stats.openElections}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closed Elections</p>
                  <p className="text-3xl font-bold">{stats.closedElections}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Election Selector */}
        {elections.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Election to View Results</label>
            <select
              className="w-full max-w-xs h-10 rounded-md border border-input bg-background px-3 py-2"
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
            >
              {elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.title} ({election.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Winner Card */}
        {winner && totalVotes > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Award className="w-12 h-12 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Leader</p>
                  <h2 className="text-2xl font-bold">{winner.name}</h2>
                  <p className="text-muted-foreground">{winner.position}</p>
                  <p className="text-lg font-semibold text-yellow-700">
                    {winner.vote_count} votes ({((winner.vote_count / totalVotes) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        {electionResults.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution (Bar Chart)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={electionResults}>
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

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution (Pie Chart)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Vote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {elections.length === 0 
                  ? 'No elections available. Create an election to see analytics.'
                  : 'No votes cast yet in this election.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results Table */}
        {electionResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Total Votes Cast:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalVotes}</span>
                </div>
                
                {electionResults.map((candidate, index) => (
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
        )}
      </div>
    </div>
  );
}
