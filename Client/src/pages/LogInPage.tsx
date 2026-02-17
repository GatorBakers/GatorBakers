import React, { useState } from 'react';
import './LogInPage.css';

interface LoginPageProps {
    onSwitchToSignUp: () => void;
}

const LoginPage = ({ onSwitchToSignUp }: LoginPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({email, password});
    }
    
    return (
        <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1 className="auth-logo">Bake</h1>
        <p className="auth-subtitle">Welcome Back</p>

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-button">
          Log In
        </button>

        <p className="auth-footer">
          Dont have an account?{" "}
          <a href="#" className="auth-link" onClick={onSwitchToSignUp}>
            Sign Up
          </a>
        </p>
      </form>
    </div>
    );
}

export default LoginPage;