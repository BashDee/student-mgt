import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import '../App.css';

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],  // Enable WebSocket and fallback to polling
});

function Dashboard({ role }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for studentAdded and gradeUpdated events
    socket.on('studentAdded', (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data.message]);
    });

    socket.on('gradeUpdated', (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data.message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('studentAdded');
      socket.off('gradeUpdated');
      socket.disconnect();  // Close the connection on component unmount
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };
  return (
    <div className="container">
      <div className="dashboard">
      {notifications.map((notification, index) => (
          <div key={index} className="notification">
            {notification}
          </div>
        ))}
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
