// src/components/StudentRecord.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import '../App.css';

import { addStudent, updateGrade, queryStudent } from '../services/blockchain';

function StudentRecord({ role }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');


  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login
    navigate('/');
  };

  const handleAddStudent = async () => {
    try {
      await axios.post('http://localhost:4000/students/add', { id, name });
      setMessage(`Student ${name} added successfully.`);
      setId('');
      setName('');
    } catch (error) {
      setMessage('Error adding student');
    }
  };

  
  const handleUpdateGrade = async () => {
    try {
      await axios.post('http://localhost:4000/grades/update', { id, course, grade });
      setMessage(`Grade updated for student ID ${id}.`);
      setCourse('');
      setGrade('');
    } catch (error) {
      setMessage('Error updating grade');
    }
  };


 const handleQueryStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/students/query/${id}`);
      setStudent(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error fetching student record');
    }
  };

   return (
    <div className="student-record-container">
      <h2>Student Record Management</h2>

      {/* HOD View */}
      {role === 'admin' && (
        <>
          <h3>Add New Student (HOD)</h3>
          <input
            type="text"
            placeholder="Student ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleAddStudent}>Add Student</button>

          <h3>Update Student Grade (HOD)</h3>
          <input
            type="text"
            placeholder="Student ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            type="text"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <button onClick={handleUpdateGrade}>Update Grade</button>
        </>
      )}

      {/* Adviser View */}
      {role === 'admin' && (
        <>
          <h3>View Student Record (Adviser)</h3>
          <input
            type="text"
            placeholder="Student ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button onClick={handleQueryStudent}>Query Student Record</button>
        </>
      )}

      {/* Student View */}
      {role === 'student' && (
        <>
          <h3>View Your Records (Student)</h3>
          <input
            type="text"
            placeholder="Your Student ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button onClick={handleQueryStudent}>Query Your Record</button>
        </>
      )}

      {/* Display the queried student record */}
      {student && (
        <div>
          <h4>Student Info:</h4>
          <p>ID: {student.id}</p>
          <p>Name: {student.name}</p>
          <p>Courses and Grades:</p>
          <ul>
            {Object.entries(student.grades).map(([course, grade]) => (
              <li key={course}>
                {course}: {grade}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message Section */}
      {message && <p>{message}</p>}
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudentRecord;