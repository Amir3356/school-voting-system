import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { electionService } from '../../services/electionService';
import { voteService } from '../../services/voteService';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

export default function StudentDashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const response = await electionService.getActive();
      setElections(response.data);
    } catch (error) {
      console.error('Failed to load elections', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Active Elections</h1>
        
        {elections.length === 0 ? (
          <p className="text-gray-600">No active elections at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <div key={election.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{election.title}</h3>
                <p className="text-gray-600 mb-4">{election.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Ends: {new Date(election.end_date).toLocaleDateString()}
                </p>
                <Link to={`/student/vote/${election.id}`}>
                  <Button className="w-full">Vote Now</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
