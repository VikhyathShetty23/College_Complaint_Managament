import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, User, Building, Loader2, Pencil, Trash2, X, Save } from 'lucide-react';

const ComplaintCard = ({ complaint, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({
    title: complaint.title,
    description: complaint.description,
    priority: complaint.priority,
    status: complaint.status,
  });

  // Extract first word of status for class (e.g. "In Progress" -> "In")
  const statusClass = complaint.status.split(' ')[0];
  
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/complaints/${complaint.complaint_id}`, { status: newStatus });
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/complaints/${complaint.complaint_id}`, editData);
      setShowEditModal(false);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      console.error('Failed to update complaint', err);
      alert('Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${complaint.complaint_id}`);
      setShowDeleteConfirm(false);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      console.error('Failed to delete complaint', err);
      alert('Failed to delete complaint');
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      title: complaint.title,
      description: complaint.description,
      priority: complaint.priority,
      status: complaint.status,
    });
    setShowEditModal(true);
  };

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-dark)', flex: 1, marginRight: '12px' }}>{complaint.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span className={`badge badge-${complaint.priority}`}>{complaint.priority}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {complaint.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-gray)' }}>
            <User size={14} className="navbar-icon" /> <span>{complaint.student_name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-gray)' }}>
            <Building size={14} className="navbar-icon" /> <span>{complaint.department_name || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-gray)' }}>
            <Calendar size={14} className="navbar-icon" /> <span>{new Date(complaint.date_submitted).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-dark)' }}>Status:</span>
            <select 
              value={complaint.status} 
              onChange={handleStatusChange} 
              disabled={updating}
              className={`badge status-${statusClass}`}
              style={{ cursor: 'pointer', border: '1px solid currentColor', outline: 'none' }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            {updating && (
              <style>
                {`
                  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                  .animate-spin { animation: spin 1s linear infinite; }
                `}
              </style>
            )}
            {updating && <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-gray)' }} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="btn-icon btn-icon-edit"
              onClick={openEditModal}
              title="Edit Complaint"
              id={`edit-btn-${complaint.complaint_id}`}
            >
              <Pencil size={15} />
            </button>
            <button
              className="btn-icon btn-icon-delete"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete Complaint"
              id={`delete-btn-${complaint.complaint_id}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Pencil size={18} className="navbar-icon" />
                Edit Complaint
              </h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={editData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  rows="4"
                  value={editData.description}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={editData.priority}
                    onChange={handleEditChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={editData.status}
                    onChange={handleEditChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn" style={{ width: 'auto' }} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#b91c1c' }}>
                <Trash2 size={18} />
                Delete Complaint
              </h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Are you sure you want to delete this complaint?
            </p>
            <p style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              "{complaint.title}"
            </p>
            <p style={{ color: '#b91c1c', fontSize: '0.8125rem', marginBottom: '1.5rem', background: '#fee2e2', padding: '0.625rem 0.75rem', borderRadius: '0.5rem' }}>
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: 'auto' }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComplaintCard;
