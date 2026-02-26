const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return 'Password must be at least 8 characters.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must include at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must include at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must include at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return 'Password must include at least one special character.';
    }
    return null;
}
