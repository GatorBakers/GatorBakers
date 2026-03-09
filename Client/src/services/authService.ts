const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Parse error response and throw with a message
async function throwApiError(response: Response, fallbackLabel: string): Promise<never> {
    let errorMessage = `${fallbackLabel} (${response.status})`;
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

// Register a new user
export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    });
    if (!response.ok) {
        await throwApiError(response, "Registration failed");
    }
    
    return;
}

// Log in an existing user
export async function loginUser(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        await throwApiError(response, "Login failed");
    }
    const data = await response.json();
    if (typeof data?.access_token !== "string" || !data.access_token) {
        throw new Error("Invalid token response from server.");
    }
    return data as { access_token: string };
}

// Refresh the access token using the refresh token cookie
export async function refreshAccessToken() {
    const response = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Session expired. Please log in again.");
    }
    const data = await response.json();
    if (typeof data?.access_token !== "string" || !data.access_token) {
        throw new Error("Invalid token response from server.");
    }
    return data as { access_token: string };
}

// Log out the user by clearing the refresh token cookie
export async function logoutUser() {
    await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });
}
