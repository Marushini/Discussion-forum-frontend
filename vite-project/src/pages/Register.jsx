import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'https://final-backend-d6dq.onrender.com/api/auth/register',
        { username, password }
      );

      console.log('Registered:', response.data);
      setSuccess('Registration successful!');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error-message">{error}</p>}
        {success ? (
          <>
            <p className="success-message">{success}</p>
            <button
              type="button"
              onClick={() => navigate('/')} // Redirect to home page
            >
              Go to Home
            </button>
          </>
        ) : (
          <>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Register</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Register;
