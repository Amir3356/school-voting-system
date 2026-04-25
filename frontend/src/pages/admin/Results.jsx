import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Shimmer from '../../components/common/Shimmer';
import { electionService } from '../../services/electionService';
import { voteService } from '../../services/voteService';

export default function Results() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const response = await electionService.getAll();
      setElections(response.data);
      if (response.data.length > 0) {
        loadResults(response.data[0].id);
        setSelectedElection(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load elections', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (electionId) => {
    try {
      setLoading(true);
      const response = await voteService.getResults(electionId);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to load results', error);
    } finally {
      setLoading(false);
    }
  };

  const handleElectionChange = (electionId) => {
    setSelectedElection(electionId);
    loadResults(electionId);
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <Shimmer type="list" count={5} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Election Results</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Election
            </label>
            <select
              value={selectedElection || ''}
              onChange={(e) => handleElectionChange(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            
            {results.length === 0 ? (
              <p className="text-gray-600">No votes recorded yet for this election.</p>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={result.candidate_id} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {index + 1}. {result.candidate_name}
                        </h3>
                        <p className="text-gray-600">{result.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{result.vote_count}</p>
                        <p className="text-sm text-gray-600">votes</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                        style={{
                          width: `${result.percentage || 0}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.percentage}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
