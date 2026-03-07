import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import { loginUser } from '../services/authService';

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isSubmitting = useRef(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const successMessage = (location.state as { success?: string })?.success;

    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting.current) return;
        isSubmitting.current = true;
        setError('');

        if (!email.trim() || !password) {
            setError('All fields are required.');
            isSubmitting.current = false;
            return;
        }

        setLoading(true);
        try {
            const { access_token, refresh_token } = await loginUser(email.trim(), password);
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            navigate('/discover');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };
    
    return (
      <AuthCard subtitle="Welcome Back" onSubmit={handleLogin}>
        {successMessage && <p className="auth-success" role="alert" aria-live="polite">{successMessage}</p>}
        {error && <p className="auth-error" role="alert" aria-live="polite">{error}</p>}
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton label={loading ? 'Logging In...' : 'Log In'} disabled={loading} />

        <AuthFooter
          message="Dont have an account?"
          linkText="Sign Up"
          linkTo="/signup"
        />
      </AuthCard>
    );
}

export default LoginPage;
