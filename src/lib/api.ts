const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Refresh failed');
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

async function request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !isRetry && !endpoint.includes('/auth/')) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })
          .then((res) => res.json());
      }) as Promise<T>;
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      headers.set('Authorization', `Bearer ${newToken}`);
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

      if (!retryResponse.ok) {
        let errorData;
        try {
          errorData = await retryResponse.json();
        } catch {
          errorData = { message: 'An unknown error occurred' };
        }
        throw new ApiError(retryResponse.status, errorData.message || retryResponse.statusText, errorData);
      }

      if (retryResponse.status === 204) return {} as T;
      return retryResponse.json();
    } catch (error) {
      processQueue(error, '');
      clearTokens();
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An unknown error occurred' };
    }
    throw new ApiError(response.status, errorData.message || response.statusText, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('shield_access_token', accessToken);
  localStorage.setItem('shield_refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('shield_access_token');
  localStorage.removeItem('shield_refresh_token');
};

export const getAccessToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('shield_access_token') : null;
};

export const getRefreshToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('shield_refresh_token') : null;
};

export const setToken = (token: string) => {
  localStorage.setItem('shield_access_token', token);
};

export const clearToken = () => {
  localStorage.removeItem('shield_access_token');
};

export const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('shield_access_token') : null;
};
