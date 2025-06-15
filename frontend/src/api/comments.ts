import { apiClient } from "./client";
import type { CreateCommentRequest, CommentTreeResponse } from "../models/comment";

export async function getPostComments(postId: string): Promise<CommentTreeResponse> {
  const res = await apiClient.get(`/comments/post/${postId}`);
  return res.data;
}

export async function createComment(data: CreateCommentRequest) {
  const res = await apiClient.post("/comments", data);
  return res.data;
}

export async function upvoteComment(commentId: string) {
  const res = await apiClient.post(`/comments/${commentId}/upvote`);
  return res.data;
}

export async function downvoteComment(commentId: string) {
  const res = await apiClient.post(`/comments/${commentId}/downvote`);
  return res.data;
} 