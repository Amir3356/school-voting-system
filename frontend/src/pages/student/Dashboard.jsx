import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { electionService } from '../../services/electionService';
import { voteService } from '../../services/voteService';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const TABS = ['Active Elections', 'My Votes', 'Results', 'Upcoming', 'Profile'];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Active Elections');
  const [activeElections, setActiveElections] = useState([]);
  const [allElections, setAllElections] = useState([]);
  const [myVotes, setMyVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [activeRes, allRes, votesRes] = await Promise.all([
        electionService.getActive(),
        electionService.getAll(),
        voteService.getMyVotes()
      ]);
      setActiveElections(Array.isArray(activeRes.data) ? activeRes.data : []);
      setAllElections(Array.isArray(allRes.data) ? allRes.data : []);
      setMyVotes(Array.isArray(votesRes.data) ? votesRes.data : []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Ended';
    if (days === 0) return 'Ends today';
    return `${days} day${days > 1 ? 's' : ''} left`;
  };

  const upcomingElections = allElections.filter(e => new Date(e.start_date) > new Date());
  const votedElectionIds = myVotes.map(v => v.election_id);

  const shimmer = (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 mb-6 shadow-md flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name} 👋</h1>
            <p className="text-blue-100 text-sm">Cast your vote and make your voice heard.</p>
          </div>
          <div className="text-5xl hidden md:block">🗳️</div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{activeElections.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active Elections</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{myVotes.length}</p>
            <p className="text-xs text-gray-500 mt-1">Votes Cast</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-orange-500">{upcomingElections.length}</p>
            <p className="text-xs text-gray-500 mt-1">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{user?.grade ?? '—'}</p>
            <p className="text-xs text-gray-500 mt-1">Your Grade</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Active Elections ── */}
        {activeTab === 'Active Elections' && (
          loading ? shimmer : allElections.length === 0 ? (
            <Empty icon="🗳️" title="No active elections" sub="Check back later for upcoming elections." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allElections.map(election => {
                const voted = votedElectionIds.includes(election.id);
                const status = getElectionStatus(election);
                return (
                  <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{election.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${status.badge}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{election.description || 'No description.'}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>📅 Starts: {new Date(election.start_date).toLocaleDateString()}</span>
                        <span>📅 Ends: {new Date(election.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span className="text-orange-500 font-medium">{getDaysLeft(election.end_date)}</span>
                        <span>👥 {election.candidates?.length ?? 0} candidates</span>
                      </div>
                      {status.canVote ? voted ? (
                        <div className="w-full text-center py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                          ✅ You already voted
                        </div>
                      ) : (
                        <Link to={`/student/vote/${election.id}`}>
                          <Button className="w-full">Vote Now</Button>
                        </Link>
                      ) : (
                        <div className={`w-full text-center py-2 text-sm font-medium rounded-lg border ${status.actionClass}`}>
                          {status.action}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── My Votes ── */}
        {activeTab === 'My Votes' && (
          loading ? shimmer : myVotes.length === 0 ? (
            <Empty icon="📋" title="No votes yet" sub="You haven't voted in any election yet." />
          ) : (
            <div className="space-y-4">
              {myVotes.map((vote, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{vote.election?.title ?? 'Election'}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Voted for: <span className="text-blue-600 font-medium">{vote.candidate?.name ?? '—'}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {vote.voted_at ? new Date(vote.voted_at).toLocaleString() : new Date(vote.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Results ── */}
        {activeTab === 'Results' && (
          <ResultsTab allElections={allElections} loading={loading} />
        )}

        {/* ── Upcoming ── */}
        {activeTab === 'Upcoming' && (
          loading ? shimmer : upcomingElections.length === 0 ? (
            <Empty icon="📅" title="No upcoming elections" sub="There are no scheduled elections at the moment." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingElections.map(election => (
                <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{election.title}</h3>
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">🔜 Soon</span>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{election.description || 'No description.'}</p>
                    <p className="text-xs text-gray-500">📅 Starts: {new Date(election.start_date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">📅 Ends: {new Date(election.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Profile ── */}
        {activeTab === 'Profile' && (
          <div className="max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white text-blue-600 text-3xl font-bold flex items-center justify-center mx-auto mb-3 shadow">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-blue-100 text-sm">{user?.email}</p>
              </div>
              <div className="p-6 space-y-4">
                <ProfileRow label="Role" value={user?.role} />
                <ProfileRow label="Student ID" value={user?.student_id ?? '—'} />
                <ProfileRow label="Grade" value={user?.grade ?? '—'} />
                <ProfileRow label="Section" value={user?.section ?? '—'} />
                <ProfileRow label="Status" value={user?.is_active ? '✅ Active' : '❌ Inactive'} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800 capitalize">{value}</span>
    </div>
  );
}

function Empty({ icon, title, sub }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-gray-700 font-medium">{title}</p>
      <p className="text-gray-400 text-sm mt-1">{sub}</p>
    </div>
  );
}

function getElectionStatus(election) {
  const now = new Date();
  const startDate = new Date(election.start_date);
  const endDate = new Date(election.end_date);

  if (!election.is_active) {
    return {
      label: 'Inactive',
      icon: '⚪',
      badge: 'bg-gray-100 text-gray-700',
      action: 'Inactive',
      actionClass: 'bg-gray-50 text-gray-500 border-gray-200',
      canVote: false,
    };
  }

  if (startDate > now) {
    return {
      label: 'Upcoming',
      icon: '🔜',
      badge: 'bg-orange-100 text-orange-700',
      action: 'Voting starts soon',
      actionClass: 'bg-orange-50 text-orange-700 border-orange-200',
      canVote: false,
    };
  }

  if (endDate < now) {
    return {
      label: 'Ended',
      icon: '⏹️',
      badge: 'bg-red-100 text-red-700',
      action: 'Election ended',
      actionClass: 'bg-red-50 text-red-700 border-red-200',
      canVote: false,
    };
  }

  return {
    label: 'Active',
    icon: '🟢',
    badge: 'bg-green-100 text-green-700',
    action: 'Vote Now',
    actionClass: 'bg-green-50 text-green-700 border-green-200',
    canVote: true,
  };
}

function ResultsTab({ allElections, loading }) {
  const [selectedId, setSelectedId] = useState('');
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleSelect = async (id) => {
    setSelectedId(id);
    if (!id) return setResults(null);
    setLoadingResults(true);
    try {
      const res = await voteService.getResults(id);
      const data = res.data ?? res;
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoadingResults(false);
    }
  };

  const candidates = Array.isArray(results?.results) ? results.results : [];
  const total = results?.total_votes ?? 0;

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Election</label>
        <select
          value={selectedId}
          onChange={e => handleSelect(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Choose an election --</option>
          {allElections.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {loadingResults && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      )}

      {!loadingResults && results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Results</h3>
            <span className="text-sm text-gray-500">Total votes: <strong>{total}</strong></span>
          </div>

          {candidates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No votes recorded yet.</p>
          ) : (
            <div className="space-y-5">
              {candidates.map((c, i) => (
                <div key={c.id ?? i}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-semibold text-gray-800">{i + 1}. {c.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{c.position}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{c.votes} votes</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${c.percentage ?? 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 text-right">{Number(c.percentage ?? 0).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loadingResults && !results && selectedId && (
        <Empty icon="📊" title="No results available" sub="This election may not have any votes yet." />
      )}

      {!selectedId && !loadingResults && (
        <Empty icon="📊" title="Select an election" sub="Choose an election above to view its results." />
      )}
    </div>
  );
}
