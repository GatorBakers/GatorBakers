interface AuthButtonProps {
  label: string;
  disabled?: boolean;
}

const AuthButton = ({ label, disabled = false }: AuthButtonProps) => {
  return (
    <>
      <style>
        {`
          .auth-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>
      <button type="submit" className="auth-button" disabled={disabled}>
        {label}
      </button>
    </>
  );
};

export default AuthButton;
