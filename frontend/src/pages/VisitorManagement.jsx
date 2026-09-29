import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Download, Edit2, Trash2 } from 'lucide-react';
import VisitorForm from '../components/VisitorForm';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VisitorManagement = () => {
  const { isAdmin } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);

  const fetchVisitors = async (search = '') => {
    try {
      const response = await axios.get(`${API_BASE}/visitors?search=${search}`);
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVisitors(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOpenModal = (visitor = null) => {
    setEditingVisitor(visitor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVisitor(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingVisitor) {
        await axios.put(`${API_BASE}/visitors/${editingVisitor._id}`, formData);
      } else {
        await axios.post(`${API_BASE}/visitors`, formData);
      }
      fetchVisitors(searchQuery);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving visitor:', error);
      alert('Failed to save visitor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visitor record?')) {
      try {
        await axios.delete(`${API_BASE}/visitors/${id}`);
        fetchVisitors(searchQuery);
      } catch (error) {
        console.error('Error deleting visitor:', error);
      }
    }
  };

  const exportToCSV = () => {
    if (visitors.length === 0) return;
    
    const headers = ['Name', 'Mobile Number', 'Company', 'Person To Meet', 'Purpose', 'Date'];
    const csvContent = [
      headers.join(','),
      ...visitors.map(v => [
        `"${v.name}"`,
        `"${v.mobileNumber}"`,
        `"${v.companyName}"`,
        `"${v.personToMeet}"`,
        `"${v.purpose}"`,
        `"${new Date(v.date).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visitors_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="visitor-management">
      <div className="toolbar">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Visitor Log</h1>
        
        <div className="search-bar">
          <Search size={20} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search by name or mobile..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAdmin && (
            <button className="btn btn-secondary" onClick={exportToCSV}>
              <Download size={18} /> Export CSV
            </button>
          )}
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Visitor
          </button>
        </div>
      </div>

      <div className="table-container glass-panel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>Host</th>
              <th>Purpose</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No visitors found.</td>
              </tr>
            ) : (
              visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td style={{ fontWeight: 500, color: 'white' }}>{visitor.name}</td>
                  <td>{visitor.mobileNumber}</td>
                  <td>{visitor.companyName}</td>
                  <td>{visitor.personToMeet}</td>
                  <td>{visitor.purpose}</td>
                  <td>{new Date(visitor.date).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleOpenModal(visitor)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      {isAdmin && (
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleDelete(visitor._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <VisitorForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmit}
        initialData={editingVisitor}
      />
    </div>
  );
};

export default VisitorManagement;
