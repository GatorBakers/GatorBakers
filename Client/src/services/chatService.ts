import { API_URL, throwApiError } from './api';

interface CreateChannelResponse {
    channelId: string;
}

interface ChatTokenResponse {
    token: string;
}

interface ChatConfigResponse {
    apiKey: string;
}

export async function createOrderChannel(
    accessToken: string,
    orderId: number,
): Promise<CreateChannelResponse> {
    const response = await fetch(`${API_URL}/chat/${orderId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to create order chat channel');
    }

    return response.json() as Promise<CreateChannelResponse>;
}

export async function fetchChatToken(accessToken: string): Promise<ChatTokenResponse> {
    const response = await fetch(`${API_URL}/chat/token`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to create chat token');
    }

    return response.json() as Promise<ChatTokenResponse>;
}

export async function fetchChatConfig(): Promise<ChatConfigResponse> {
    const response = await fetch(`${API_URL}/chat/config`, {
        credentials: 'include',
    });

    if (!response.ok) {
        await throwApiError(response, 'Failed to load chat configuration');
    }

    return response.json() as Promise<ChatConfigResponse>;
}
