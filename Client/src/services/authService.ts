const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Register a new user
export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Registration failed");
    }
    return response.json();
}
