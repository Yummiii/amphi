import { apiClient } from "./client";
import type { User } from "../models/user";

export async function getUserProfile(id: string): Promise<User[]> {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
}
