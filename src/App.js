import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute'; 
import StudentRecord from './components/StudentRecord';


import './App.css';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Login Route */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />

          {/* Dashboard Route protected by PrivateRoute */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <StudentRecord role={role} />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
