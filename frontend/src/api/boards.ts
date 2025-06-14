import type { Board } from "../models/boards";
import { apiClient } from "./client";

export async function getBoards(): Promise<Board[]> {
  const res = await apiClient.get("/boards");
  return res.data;
}

export async function getBoard(slug: string): Promise<Board> {
  const res = await apiClient.get(`/boards/${slug}`);
  return res.data;
}
