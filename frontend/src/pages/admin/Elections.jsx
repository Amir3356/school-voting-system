import { useState, useEffect } from 'react';
import { getElections, createElection, updateElection, updateElectionStatus, deleteElection } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Trash2, Power, Edit } from 'lucide-react';

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentElection, setCurrentElection] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    status: 'closed',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await getElections();
      setElections(response.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createElection(formData);
      setShowDialog(false);
      setFormData({ title: '', description: '', status: 'closed', start_time: '', end_time: '' });
      fetchElections();
    } catch (error) {
      alert('Failed to create election');
    }
  };

  const handleEdit = (election) => {
    setEditMode(true);
    setCurrentElection(election);
    setFormData({
      title: election.title,
      description: election.description || '',
      status: election.status,
      start_time: election.start_time ? new Date(election.start_time).toISOString().slice(0, 16) : '',
      end_time: election.end_time ? new Date(election.end_time).toISOString().slice(0, 16) : ''
    });
    setShowDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateElection(currentElection.id, formData);
      setShowDialog(false);
      setEditMode(false);
      setCurrentElection(null);
      setFormData({ title: '', description: '', status: 'closed', start_time: '', end_time: '' });
      fetchElections();
    } catch (error) {
      alert('Failed to update election');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await updateElectionStatus(id, newStatus);
      fetchElections();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this election?')) {
      try {
        await deleteElection(id);
        fetchElections();
      } catch (error) {
        alert('Failed to delete election');
      }
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditMode(false);
    setCurrentElection(null);
    setFormData({ title: '', description: '', status: 'closed', start_time: '', end_time: '' });
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Elections</h1>
            <p className="text-muted-foreground">Create and manage school elections</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Election
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elections.map((election) => (
                  <TableRow key={election.id}>
                    <TableCell className="font-medium">{election.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{election.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        election.status === 'open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {election.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(election.start_time)}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(election.end_time)}</TableCell>
                    <TableCell>{new Date(election.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(election)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(election.id, election.status)}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(election.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
          <DialogContent onClose={handleCloseDialog}>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Election' : 'Create New Election'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editMode ? handleUpdate : handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="closed">Closed</option>
                  <option value="open">Open</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time (Optional)</label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Time (Optional)</label>
                <Input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                {editMode ? 'Update Election' : 'Create Election'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
