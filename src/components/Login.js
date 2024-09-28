// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';



function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      
      // Check if the response has a token
      const { token, role } = response.data;
      
      // Save the token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
  
      // Invoke the parent component's onLogin function
      onLogin(role);

      navigate('/dashboard');

      
    } catch (error) {
      // Handle any errors, including 401 Unauthorized
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (such as 401 Unauthorized)
        console.error('Login error:', error.response.data);
        alert(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response from server:', error.request);
        alert('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Login error:', error.message);
        alert('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;


