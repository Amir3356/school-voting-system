import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Shimmer from '../../components/common/Shimmer';
import { candidateService } from '../../services/candidateService';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await candidateService.getAll();
      setCandidates(response.data);
    } catch (error) {
      console.error('Failed to load candidates', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Candidates Management</h1>
            <Link to="/admin/candidates/create">
              <Button>Add New Candidate</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.position}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{candidate.description}</p>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Grade:</strong> {candidate.grade}</p>
                  <p><strong>Section:</strong> {candidate.section}</p>
                </div>

                <div className="flex space-x-2">
                  <Link to={`/admin/candidates/${candidate.id}/edit`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">Edit</Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex-1">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
