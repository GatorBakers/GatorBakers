const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Register a new user
export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    });
    if (!response.ok) {
        let errorMessage = `Registration failed (${response.status})`;
        const text = await response.text().catch(() => '');
        try {
            const errorData = JSON.parse(text);
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }
        } catch {
            if (import.meta.env.DEV) {
                console.error(`Server error ${response.status}:`, text || response.statusText);
            }
        }
        throw new Error(errorMessage);
    }
    
    return;
}

// Log in an existing user
export async function loginUser(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const text = await response.text().catch(() => '');

    if (!response.ok) {
        let errorMessage = `Login failed (${response.status})`;
        try {
            const errorData = JSON.parse(text);
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }
        } catch {
            if (import.meta.env.DEV) {
                console.error(`Server error ${response.status}:`, text || response.statusText);
            }
        }
        throw new Error(errorMessage);
    }

    // Server returns 200 with a plain string for invalid credentials
    try {
        const data = JSON.parse(text);
        if (typeof data === 'string') {
            throw new Error(data);
        }
        return data as { access_token: string; refresh_token: string };
    } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error('Unexpected response from server.');
    }
}
