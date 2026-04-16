import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dept_id: '',
    title: '',
    description: '',
    priority: 'Low'
  });
  
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch departments on load
    axios.get('http://localhost:5000/api/departments')
      .then(res => {
          if (res.data && res.data.length > 0) {
              setDepartments(res.data);
          } else {
              setFallbackDepartments();
          }
      })
      .catch(err => {
          console.error("Failed to load departments, using fallbacks", err);
          setFallbackDepartments();
      });
  }, []);

  const setFallbackDepartments = () => {
      // Fallback hardcoded departments if the database relies on specific IDs
      setDepartments([
          { dept_id: 1, dept_name: 'Computer Science' },
          { dept_id: 2, dept_name: 'Information Science' },
          { dept_id: 3, dept_name: 'Electronics and Communication' },
          { dept_id: 4, dept_name: 'Civil' },
          { dept_id: 5, dept_name: 'Mechanical' },
          { dept_id: 6, dept_name: 'AI&ML' },
          { dept_id: 7, dept_name: 'AI&DS' },
          { dept_id: 8, dept_name: 'Robotics' }
      ]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      const studentRes = await axios.post('http://localhost:5000/api/students', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dept_id: formData.dept_id
      });
      
      const studentId = studentRes.data.student_id;

      await axios.post('http://localhost:5000/api/complaints', {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        student_id: studentId,
        dept_id: formData.dept_id
      });

      setAlert({ type: 'success', message: 'Complaint submitted successfully! Redirecting...' });
      setFormData({
        name: '', email: '', phone: '', dept_id: '', title: '', description: '', priority: 'Low'
      });
      
      setTimeout(() => {
        setAlert(null);
        navigate('/complaints');
      }, 2000);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to submit complaint.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Submit a Complaint</h2>
      
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="e.g. Alice Johnson" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" placeholder="alice@example.com" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Phone</label>
            <input type="text" name="phone" className="form-input" placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Department</label>
            <select name="dept_id" className="form-select" value={formData.dept_id} onChange={handleChange} required>
              <option value="" disabled>Select Department</option>
              {departments.map(dept => (
                <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_name}</option>
              ))}
            </select>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

        <div className="form-group">
          <label className="form-label">Complaint Title</label>
          <input type="text" name="title" className="form-input" placeholder="Brief summary of the issue" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-textarea" rows="4" placeholder="Provide more details about your complaint..." value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Priority</label>
          <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Submitting...' : <><Send size={18} /> Submit Complaint</>}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
