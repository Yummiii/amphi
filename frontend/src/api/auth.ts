import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../models/auth";
import type { User } from "../models/user";
import { apiClient } from "./client";

export const login = async (login: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post("/users/login", login);
  return response.data;
};

export const register = async (
  registerData: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await apiClient.post("/users/register", registerData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/users/me");
  return response.data;
};
