import React from 'react';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}

const AuthInput = ({ id, label, type, placeholder, value, onChange, autoComplete }: AuthInputProps) => {
  return (
    <div className="auth-input-group">
      <label htmlFor={id} className="auth-input-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="auth-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default AuthInput;
