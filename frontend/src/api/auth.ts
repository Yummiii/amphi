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
  const formData = new FormData();
  formData.append("email", registerData.email);
  formData.append("username", registerData.username);
  formData.append("password", registerData.password);
  formData.append("birthdate", registerData.birthdate);

  if (registerData.avatar) {
    formData.append("avatar", registerData.avatar);
  }

  const response = await apiClient.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/users/me");
  return response.data;
};
