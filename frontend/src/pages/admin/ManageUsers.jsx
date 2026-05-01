import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Shimmer from '../../components/common/Shimmer';
import { userService } from '../../services/userService';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await userService.getAll(params);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers({ search, role: roleFilter });
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    loadUsers({ search, role });
  };

  const handleToggleStatus = async (user) => {
    setTogglingId(user.id);
    try {
      const res = await userService.toggleStatus(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: res.data.is_active } : u));
    } catch {
      alert('Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(id);
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err?.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  const nonAdminUsers = users.filter(u => u.role !== 'admin');
  const students = nonAdminUsers.filter(u => u.role === 'student');
  const filtered = roleFilter === 'student' ? students : nonAdminUsers;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
            <p className="text-gray-500 mt-1">View and manage all registered users</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{nonAdminUsers.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Users</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-green-600">{students.length}</p>
              <p className="text-xs text-gray-500 mt-1">Students</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-purple-600">{nonAdminUsers.length}</p>
              <p className="text-xs text-gray-500 mt-1">Visible Users</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email or student ID..."
                className="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Search
              </button>
              <button type="button" onClick={() => { setSearch(''); setRoleFilter(''); loadUsers(); }} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Reset
              </button>
            </form>

            {/* Role Filter Tabs */}
            <div className="flex gap-2 mt-3">
              {['', 'student'].map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleFilter(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === role ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {role === '' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Shimmer type="table" count={6} />
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Grade / Section</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.student_id ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.grade ? `${user.grade} / ${user.section}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={togglingId === user.id}
                          title={user.is_active ? 'Click to deactivate user' : 'Click to activate user'}
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors focus:outline-none ${
                            togglingId === user.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          } ${user.is_active ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                          aria-label={user.is_active ? 'Set Inactive' : 'Set Active'}
                        >
                          {user.is_active ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 5h5v14H5zM14 5h5v14h-5z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                        <span className={`ml-2 text-xs font-medium ${user.is_active ? 'text-red-600' : 'text-green-600'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
