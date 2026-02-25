import React from 'react';
import './Auth.css';

interface AuthCardProps {
  subtitle: string;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

const AuthCard = ({ subtitle, onSubmit, children }: AuthCardProps) => {
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1 className="auth-logo">Bake</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </form>
    </div>
  );
};

export default AuthCard;
