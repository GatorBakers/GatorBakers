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
        try {
            const errorData = await response.json();
            if (errorData?.message) {
                errorMessage = errorData.message;
            }
        } catch {
            const text = await response.text().catch(() => '');
            console.error(`Server error ${response.status}:`, text || response.statusText);
        }
        throw new Error(errorMessage);
    }
    return response.json();
}
