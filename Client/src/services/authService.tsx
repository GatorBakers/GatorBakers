const API_URL = "http://localhost:4000";

// Register a new user
export async function registerUser(email: string, password: string, first_name: string, last_name: string) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name, last_name }),
    });
    return response.json();
}
