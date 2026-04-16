import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      
      <main className="container mb-6" style={{ paddingTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<ComplaintForm />} />
          <Route path="/complaints" element={
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-dark)' }}>All Complaints</h2>
              </div>
              <ComplaintList />
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
