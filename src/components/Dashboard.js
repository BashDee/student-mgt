import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


function Dashboard({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login
    navigate('/');
  };

  return (
    <div className="container">
      <div className="dashboard">
        <h2>Welcome to the Dashboard</h2>
        {role === 'admin' && (
          <div>
            <h3>Admin Dashboard (HOD or Adviser)</h3>
            <p>You have admin privileges. You can manage student records.</p>
          </div>
        )}
        {role === 'student' && (
          <div>
            <h3>Student Dashboard</h3>
            <p>Welcome, student! You can view your academic records here.</p>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
