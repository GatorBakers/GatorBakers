import React from 'react';

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput = ({ type, placeholder, value, onChange }: AuthInputProps) => {
  return (
    <input
      type={type}
      className="auth-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default AuthInput;
