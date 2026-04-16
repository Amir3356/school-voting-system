import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getStudentStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileDown, BarChart3, ArrowLeft } from 'lucide-react';
import { downloadDashboardReport, formatDate } from '../../lib/report';

export default function StudentReports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [electionsRes, statsRes] = await Promise.all([
        getElections(),
        getStudentStats()
      ]);

      setElections(electionsRes.data || []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    if (election.start_time && new Date(election.start_time) > now) return 'Upcoming';
    if (election.end_time && new Date(election.end_time) <= now) return 'Closed';
    if (election.status === 'open') return 'Open';
    return 'Closed';
  };

  const handleGenerateReport = () => {
    downloadDashboardReport({
      fileName: 'student-dashboard-report.pdf',
      title: 'Student Dashboard Report',
      generatedBy: user?.username || 'Student',
      summaryRows: [
        ['Student', user?.username || 'N/A'],
        ['Total Elections', stats?.totalElections ?? elections.length],
        ['Votes Cast', stats?.votedElections ?? 0],
        ['Active Elections', stats?.activeElections ?? 0]
      ],
      tableHeaders: ['Title', 'Status', 'Start', 'End'],
      tableRows: elections.map((election) => [
        election.title,
        getElectionStatus(election),
        formatDate(election.start_time),
        formatDate(election.end_time)
      ])
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">Download your election overview as a PDF file.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileDown className="w-4 h-4 mr-2" />
              Generate Report (PDF)
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Elections</p>
              <p className="text-3xl font-bold">{stats?.totalElections ?? elections.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Votes Cast</p>
              <p className="text-3xl font-bold">{stats?.votedElections ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active Elections</p>
              <p className="text-3xl font-bold">{stats?.activeElections ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Election Overview
            </CardTitle>
            <CardDescription>Use this list to review current and completed elections.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {elections.length === 0 && (
                <div className="text-sm text-muted-foreground">No elections available.</div>
              )}

              {elections.map((election) => (
                <div key={election.id} className="p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="font-semibold">{election.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Status: {getElectionStatus(election)} | Start: {formatDate(election.start_time)} | End: {formatDate(election.end_time)}
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/student/results/${election.id}`)}>
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}