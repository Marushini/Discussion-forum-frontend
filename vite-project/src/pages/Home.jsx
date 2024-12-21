import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Discussion Forum</h1>
      <p className="home-description">
        Connect, share, and discuss ideas with the community!
      </p>

      <div className="home-card-container">
        <Link to="/login" className="home-card login-card">
          <h2>Login</h2>
          <p>Access your account and join the discussion!</p>
        </Link>

        <Link to="/register" className="home-card register-card">
          <h2>Register </h2>
          <p>Create an account to start posting today!</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
