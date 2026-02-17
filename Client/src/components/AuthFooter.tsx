interface AuthFooterProps {
  message: string;
  linkText: string;
  onLinkClick: () => void;
}

const AuthFooter = ({ message, linkText, onLinkClick }: AuthFooterProps) => {
  return (
    <p className="auth-footer">
      {message}{" "}
      <a href="#" className="auth-link" onClick={onLinkClick}>
        {linkText}
      </a>
    </p>
  );
};

export default AuthFooter;
