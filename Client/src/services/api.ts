export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Parse error response and throw with a meaningful message
export async function throwApiError(response: Response, fallbackLabel: string): Promise<never> {
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
