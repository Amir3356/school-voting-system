import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getUsers } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Vote, BarChart3, Settings, FileDown } from 'lucide-react';
import { downloadDashboardReport, formatDate } from '../../lib/report';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ elections: 0, users: 0, openElections: 0, closedElections: 0, upcomingElections: 0 });
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [electionsRes, usersRes] = await Promise.all([
        getElections(),
        getUsers()
      ]);

      const electionList = electionsRes.data || [];
      const now = new Date();

      const openElections = electionList.filter((election) => {
        const startsLater = election.start_time && new Date(election.start_time) > now;
        const alreadyEnded = election.end_time && new Date(election.end_time) <= now;
        return election.status === 'open' && !startsLater && !alreadyEnded;
      }).length;

      const upcomingElections = electionList.filter((election) => election.start_time && new Date(election.start_time) > now).length;
      const closedElections = electionList.length - openElections - upcomingElections;

      setElections(electionList);

      setStats({
        elections: electionList.length,
        users: usersRes.data.length,
        openElections,
        closedElections,
        upcomingElections
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getElectionState = (election) => {
    const now = new Date();
    if (election.start_time && new Date(election.start_time) > now) return 'Upcoming';
    if (election.end_time && new Date(election.end_time) <= now) return 'Closed';
    if (election.status === 'open') return 'Open';
    return 'Closed';
  };

  const handleGenerateReport = () => {
    downloadDashboardReport({
      fileName: 'admin-dashboard-report.pdf',
      title: 'Admin Dashboard Report',
      generatedBy: 'Admin',
      summaryRows: [
        ['Total Elections', stats.elections],
        ['Total Users', stats.users],
        ['Open Elections', stats.openElections],
        ['Upcoming Elections', stats.upcomingElections],
        ['Closed Elections', stats.closedElections]
      ],
      tableHeaders: ['Title', 'Status', 'Start', 'End'],
      tableRows: elections.map((election) => [
        election.title,
        getElectionState(election),
        formatDate(election.start_time),
        formatDate(election.end_time)
      ])
    });
  };

  const menuItems = [
    {
      title: 'Manage Elections',
      description: 'Create and manage elections',
      icon: Vote,
      path: '/admin/elections',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Candidates',
      description: 'Add and edit candidates',
      icon: Users,
      path: '/admin/candidates',
      color: 'bg-green-500'
    },
    {
      title: 'View Analytics',
      description: 'Election results and statistics',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Users',
      description: 'View and manage students',
      icon: Settings,
      path: '/admin/users',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage school elections and users</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Button onClick={handleGenerateReport} className="font-semibold">
              <FileDown className="w-4 h-4 mr-2" />
              Generate Report (PDF)
            </Button>
          </div>
        </div>

        <div className="flex justify-center items-center mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-2xl">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Elections</p>
                    <p className="text-3xl font-bold">{stats.elections}</p>
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
                    <p className="text-3xl font-bold">{stats.users}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(item.path)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
