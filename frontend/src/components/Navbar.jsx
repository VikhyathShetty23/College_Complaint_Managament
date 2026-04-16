import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard className="navbar-icon" size={24} />
          <Link to="/" className="navbar-brand">CampusResolve</Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '500' }}>Submit Complaint</Link>
          <Link to="/complaints" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '500' }}>View Complaints</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
