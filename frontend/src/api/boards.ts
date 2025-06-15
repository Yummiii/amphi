import type { Board } from "../models/board";
import { apiClient } from "./client";

export interface CreateBoardRequest {
  name: string;
  description: string;
  slug: string;
  image?: File;
}

export async function createBoard(data: CreateBoardRequest) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("slug", data.slug);

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.post("/boards", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function getBoards(): Promise<Board[]> {
  const res = await apiClient.get("/boards");
  return res.data;
}

export async function getBoard(slug: string): Promise<Board> {
  const res = await apiClient.get(`/boards/${slug}`);
  return res.data;
}

export async function joinBoard(slug: string) {
  const res = await apiClient.post(`/boards/${slug}/join`);
  return res.data;
}

export async function leaveBoard(slug: string) {
  const res = await apiClient.post(`/boards/${slug}/leave`);
  return res.data;
}

export async function deleteBoard(slug: string) {
  const res = await apiClient.delete(`/boards/${slug}`);
  return res.data;
}
