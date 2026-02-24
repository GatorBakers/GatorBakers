interface AuthButtonProps {
  label: string;
  disabled?: boolean;
}

const AuthButton = ({ label, disabled = false }: AuthButtonProps) => {
  return (
    <button type="submit" className="auth-button" disabled={disabled}>
      {label}
    </button>
  );
};

export default AuthButton;
