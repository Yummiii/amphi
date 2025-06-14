import type { Post } from "./post";
import type { User } from "./user";

export const BoardMemberRoles = {
  Admin: 0,
  Member: 1,
} as const;

export type BoardMemberRoles =
  (typeof BoardMemberRoles)[keyof typeof BoardMemberRoles];

export interface Board {
  id: number;
  name: string;
  slug: string;
  description: string;
  posts: Post[];
  members: BoardMember[];
}

export interface BoardMember {
  role: BoardMemberRoles;
  user: User;
}
