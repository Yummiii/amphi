import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { CommentVote, User } from "generated/prisma";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  postId: string;

  @IsOptional()
  parentId?: string;
}

export class CommentResponseDto {
  id: string;
  content: string;
  level: number;
  postId: string;
  authorId: string;
  parentId?: string;
  createdAt: Date;
  author: User;
  votes: CommentVote[];
  replies?: CommentResponseDto[];
  votesCount: number;
  userVote?: number;
}

export class CommentTreeResponseDto {
  comments: CommentResponseDto[];
  totalCount: number;
}
