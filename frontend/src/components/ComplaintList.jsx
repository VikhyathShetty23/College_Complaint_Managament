import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComplaintCard from './ComplaintCard';
import { Loader2, AlertCircle, FileSearch } from 'lucide-react';

const ComplaintList = ({ refreshTrigger }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [refreshTrigger]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <style>
          {`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin { animation: spin 1s linear infinite; }
          `}
        </style>
        <Loader2 className="navbar-icon animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error" style={{ marginBottom: '0' }}>
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', color: 'var(--text-gray)' }}>
        <FileSearch size={32} style={{ margin: '0 auto 1rem', color: 'var(--border-color)' }} />
        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>No complaints found</p>
        <p style={{ fontSize: '0.875rem' }}>Be the first to submit a complaint using the form.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.complaint_id} complaint={complaint} onStatusChange={fetchComplaints} />
      ))}
    </div>
  );
};

export default ComplaintList;
