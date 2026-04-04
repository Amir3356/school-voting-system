import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Vote, Clock, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await getElections();
      setElections(response.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">View and participate in school elections</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading elections...</div>
        ) : elections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Vote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No elections available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {elections.map((election) => (
              <Card key={election.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{election.title}</CardTitle>
                    {election.status === 'open' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Open
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Closed
                      </span>
                    )}
                  </div>
                  <CardDescription>{election.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {election.status === 'open' ? (
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/student/vote/${election.id}`)}
                      >
                        Vote Now
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/student/results/${election.id}`)}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
