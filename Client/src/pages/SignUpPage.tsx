import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import { registerUser } from '../services/authService';
import { isValidEmail, isValidName, validatePassword } from '@shared/utils/validation';

const SignUpPage = () => {
    const navigate = useNavigate();
    const isSubmitting = useRef(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting.current) return;
        isSubmitting.current = true;
        setError('');

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
            setError('All fields are required.');
            isSubmitting.current = false;
            return;
        }
        if (!isValidName(firstName)) {
            setError('First name can only contain letters, hyphens, apostrophes, periods, and spaces.');
            isSubmitting.current = false;
            return;
        }
        if (!isValidName(lastName)) {
            setError('Last name can only contain letters, hyphens, apostrophes, periods, and spaces.');
            isSubmitting.current = false;
            return;
        }
        if (!isValidEmail(email.trim())) {
            setError('Please enter a valid email address.');
            isSubmitting.current = false;
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            isSubmitting.current = false;
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            isSubmitting.current = false;
            return;
        }

        setLoading(true);
        
        try {
            await registerUser(email.trim(), password, firstName.trim(), lastName.trim());
            navigate('/login', { state: { success: 'Account created successfully. Please log in.' } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <AuthCard subtitle="Create an Account" onSubmit={handleSignUp}>
            <AuthInput
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <AuthInput
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
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
            <AuthInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="auth-error" role="alert" aria-live="polite">{error}</p>}
            <AuthButton label={loading ? 'Signing Up...' : 'Sign Up'} disabled={loading} />
            <AuthFooter
                message="Already have an account?"
                linkText="Log In"
                linkTo="/login"
            />
        </AuthCard>
    );
}

export default SignUpPage;