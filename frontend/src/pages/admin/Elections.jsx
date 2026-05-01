import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Shimmer from '../../components/common/Shimmer';
import { electionService } from '../../services/electionService';

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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

  const handleToggleStatus = async (election) => {
    setTogglingId(election.id);
    try {
      await electionService.update(election.id, { ...election, is_active: !election.is_active });
      setElections(prev =>
        prev.map(e => e.id === election.id ? { ...e, is_active: !e.is_active } : e)
      );
    } catch (error) {
      alert('Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this election?')) return;
    setDeletingId(id);
    try {
      await electionService.delete(id);
      setElections(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      alert('Failed to delete election.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <Shimmer type="table" count={6} />
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
            <h1 className="text-3xl font-bold">Elections Management</h1>
            <Link to="/admin/elections/create">
              <Button>Create New Election</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No elections found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  elections.map((election) => (
                    <tr key={election.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{election.title}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{election.description}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(election)}
                          disabled={togglingId === election.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            election.is_active ? 'bg-green-500' : 'bg-gray-300'
                          } ${togglingId === election.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              election.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`ml-2 text-sm font-medium ${election.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                          {election.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Link to={`/admin/elections/${election.id}/edit`}>
                          <Button size="sm" variant="outline">Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(election.id)}
                          disabled={deletingId === election.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {deletingId === election.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
