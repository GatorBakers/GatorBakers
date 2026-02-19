import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthFooter from '../components/AuthFooter';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({email, password});
    }
    
    return (
      <AuthCard subtitle="Welcome Back" onSubmit={handleLogin}>
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

        <AuthButton label="Log In" />

        <AuthFooter
          message="Dont have an account?"
          linkText="Sign Up"
          linkTo="/signup"
        />
      </AuthCard>
    );
}

export default LoginPage;
