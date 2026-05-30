const API = "/api";

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export function register(email: string, password: string): Promise<AuthResponse> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function me(token: string): Promise<AuthUser> {
  return request("/auth/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
