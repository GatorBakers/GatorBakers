import { Link } from 'react-router-dom';

interface AuthFooterProps {
  message: string;
  linkText: string;
  linkTo: string;
}

const AuthFooter = ({ message, linkText, linkTo }: AuthFooterProps) => {
  return (
    <p className="auth-footer">
      {message}{" "}
      <Link to={linkTo} className="auth-link">
        {linkText}
      </Link>
    </p>
  );
};

export default AuthFooter;
