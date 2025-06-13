import type { LoginRequest, LoginResponse } from "../models/auth";
import { apiClient } from "./client";

export const login = async (login: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/users/login", login);
  return response.data;
};
