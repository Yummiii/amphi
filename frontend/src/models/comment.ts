import type { User } from "./user";

export interface CommentVote {
  commentId: string;
  userId: string;
  value: number;
}

export interface Comment {
  id: string;
  content: string;
  level: number;
  postId: string;
  authorId: string;
  parentId?: string;
  createdAt: Date;
  author: User;
  votes: CommentVote[];
  replies?: Comment[];
  votesCount: number;
}

export interface CommentTreeResponse {
  comments: Comment[];
  totalCount: number;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string;
}
