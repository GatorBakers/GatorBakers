interface AuthButtonProps {
  label: string;
}

const AuthButton = ({ label }: AuthButtonProps) => {
  return (
    <button type="submit" className="auth-button">
      {label}
    </button>
  );
};

export default AuthButton;
