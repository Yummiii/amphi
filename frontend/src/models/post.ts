import type { User } from "./user";

export interface Post {
  id: string;
  title: string;
  content: string;
  attachment: string | null;
  createdAt: string;
  author: User;
  upvotes?: number;
  downvotes?: number;
}
