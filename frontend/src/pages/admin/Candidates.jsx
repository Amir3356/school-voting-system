import { useState, useEffect } from 'react';
import { getElections, getCandidatesByElection, createCandidate, deleteCandidate } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Trash2 } from 'lucide-react';

export default function Candidates() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', position: '', photo: '' });

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates();
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const response = await getElections();
      setElections(response.data);
      if (response.data.length > 0) {
        setSelectedElection(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await getCandidatesByElection(selectedElection);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCandidate({ ...formData, election_id: selectedElection });
      setShowDialog(false);
      setFormData({ name: '', position: '', photo: '' });
      fetchCandidates();
    } catch (error) {
      alert('Failed to create candidate');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(id);
        fetchCandidates();
      } catch (error) {
        alert('Failed to delete candidate');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Candidates</h1>
            <p className="text-muted-foreground">Add and manage election candidates</p>
          </div>
          <Button onClick={() => setShowDialog(true)} disabled={!selectedElection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Select Election</label>
          <select
            className="w-full max-w-xs h-10 rounded-md border border-input bg-background px-3 py-2"
            value={selectedElection}
            onChange={(e) => setSelectedElection(e.target.value)}
          >
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.title}
              </option>
            ))}
          </select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Photo URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {candidate.photo || 'No photo'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(candidate.id)}
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

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent onClose={() => setShowDialog(false)}>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo URL (optional)</label>
                <Input
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Add Candidate</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
