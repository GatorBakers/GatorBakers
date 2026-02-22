import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';
import { registerUser } from '../services/authService';

const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return;
        }
        const data = await registerUser(email, password, firstName, lastName);
        console.log(data);
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
            <AuthButton label="Sign Up" />
            <AuthFooter
                message="Already have an account?"
                linkText="Log In"
                linkTo="/login"
            />
        </AuthCard>
    );
}

export default SignUpPage;