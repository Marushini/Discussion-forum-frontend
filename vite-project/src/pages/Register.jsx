import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <label>Username:</label><br />
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required 
      /><br />
      
      <label>Password:</label><br />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      /><br />
      
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
