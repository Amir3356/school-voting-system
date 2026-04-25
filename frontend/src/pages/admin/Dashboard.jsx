import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { electionService } from '../../services/electionService';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Shimmer from '../../components/common/Shimmer';

export default function AdminDashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const response = await electionService.getAll();
      setElections(response.data);
    } catch (error) {
      console.error('Failed to load elections', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <Shimmer type="stats" count={3} />
          <div className="h-8 bg-gray-200 rounded w-48 my-6 animate-pulse"></div>
          <Shimmer type="table" count={5} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link to="/admin/elections/create">
            <Button>Create Election</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Total Elections</h3>
            <p className="text-3xl font-bold text-blue-600">{elections.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Active Elections</h3>
            <p className="text-3xl font-bold text-green-600">
              {elections.filter(e => e.is_active).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Quick Actions</h3>
            <div className="mt-2 space-y-2">
              <Link to="/admin/candidates/create">
                <Button size="sm" className="w-full">Add Candidate</Button>
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">All Elections</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Start Date</th>
                <th className="px-6 py-3 text-left">End Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr key={election.id} className="border-t">
                  <td className="px-6 py-4">{election.title}</td>
                  <td className="px-6 py-4">
                    {new Date(election.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(election.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      election.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {election.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/elections/${election.id}/results`}>
                      <Button size="sm" variant="outline">View Results</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}
