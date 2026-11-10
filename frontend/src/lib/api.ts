import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "./auth";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

/** Authenticated client (attaches access token + auto-refreshes on 401). */
export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

/** Bare client for token endpoints (no interceptors -> no refresh loops). */
const authClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ---- Types ----
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface Profile {
  userId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  addressLine1: string | null;
  city: string | null;
  country: string | null;
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
}

// ---- Interceptors ----
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("No refresh token");
  const { data } = await authClient.post<AuthResponse>("/api/v1/auth/refresh", { refreshToken });
  tokenStore.set(data.accessToken, data.refreshToken);
  return data.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry && tokenStore.getRefresh()) {
      original._retry = true;
      try {
        refreshing = refreshing ?? refreshAccessToken();
        const newToken = await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        tokenStore.clear();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);

// ---- Endpoints ----
export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await authClient.post<AuthResponse>("/api/v1/auth/register", payload);
  return data;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await authClient.post<AuthResponse>("/api/v1/auth/login", { email, password });
  return data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await authClient.post("/api/v1/auth/logout", { refreshToken });
}

export async function getMe(): Promise<Profile> {
  const { data } = await api.get<Profile>("/api/v1/users/me");
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const { data } = await api.put<Profile>("/api/v1/users/me/profile", payload);
  return data;
}
