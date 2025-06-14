import { apiClient } from "./client";

export interface CreatePostRequest {
  content: string;
  board: string;
  attachment?: File;
}

export async function createPost(data: CreatePostRequest) {
  const formData = new FormData();
  formData.append("content", data.content);
  formData.append("board", data.board);

  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  const res = await apiClient.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function upvotePost(postId: string) {
  const res = await apiClient.post(`/posts/${postId}/upvote`);
  return res.data;
}

export async function downvotePost(postId: string) {
  const res = await apiClient.post(`/posts/${postId}/downvote`);
  return res.data;
}
