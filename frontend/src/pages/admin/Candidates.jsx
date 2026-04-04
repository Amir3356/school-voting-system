import { useState, useEffect } from 'react';
import { getElections, getCandidatesByElection, createCandidate, updateCandidate, deleteCandidate } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Trash2, Upload, Edit } from 'lucide-react';

export default function Candidates() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('election_id', selectedElection);
      
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      await createCandidate(formDataToSend);
      
      handleCloseDialog();
      fetchCandidates();
    } catch (error) {
      alert('Failed to create candidate: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (candidate) => {
    setEditMode(true);
    setCurrentCandidate(candidate);
    setFormData({
      name: candidate.name,
      position: candidate.position
    });
    // Set existing photo as preview
    if (candidate.photo) {
      setPhotoPreview(`http://localhost:5000${candidate.photo}`);
    }
    setShowDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.position);
      
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      await updateCandidate(currentCandidate.id, formDataToSend);
      
      handleCloseDialog();
      fetchCandidates();
    } catch (error) {
      alert('Failed to update candidate: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
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

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditMode(false);
    setCurrentCandidate(null);
    setFormData({ name: '', position: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
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
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      {candidate.photo ? (
                        <img 
                          src={`http://localhost:5000${candidate.photo}`} 
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No photo</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(candidate)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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

        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
          <DialogContent onClose={handleCloseDialog}>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editMode ? handleUpdate : handleCreate} className="space-y-4 mt-4">
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
                <label className="text-sm font-medium">Photo</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center justify-center px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Max size: 5MB. Formats: JPG, PNG, GIF, WebP
                  {editMode && !photoFile && ' (Leave empty to keep current photo)'}
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? 'Uploading...' : (editMode ? 'Update Candidate' : 'Add Candidate')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
