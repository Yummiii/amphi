import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateCommentDto,
  CommentResponseDto,
  CommentTreeResponseDto,
} from "../../models";
import { NotFoundException, ValidationException } from "../../common";

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<CommentResponseDto> {
    const { content, postId, parentId } = createCommentDto;

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException("Post");
    }

    let level = 0;

    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, level: true, postId: true },
      });

      if (!parentComment) {
        throw new NotFoundException("Parent comment");
      }

      if (parentComment.postId !== postId) {
        throw new ValidationException(
          "Parent comment does not belong to the specified post",
        );
      }

      level = parentComment.level + 1;

      if (level > 7) {
        throw new ValidationException("Maximum comment depth exceeded");
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId,
        level,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        votes: true,
      },
    });

    return this.mapCommentToDto(comment, authorId);
  }

  async getCommentsByPost(
    postId: string,
    currentUserId?: string,
  ): Promise<CommentTreeResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException("Post");
    }

    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        votes: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const commentTree = this.buildCommentTree(comments, currentUserId);

    return {
      comments: commentTree,
      totalCount: comments.length,
    };
  }

  async voteOnComment(
    commentId: string,
    userId: string,
    value: number,
  ): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException("Comment");
    }

    await this.prisma.commentVote.upsert({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
      update: { value },
      create: {
        commentId,
        userId,
        value,
      },
    });

    const updatedComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        votes: true,
      },
    });

    return this.mapCommentToDto(updatedComment, userId);
  }

  private buildCommentTree(
    comments: any[],
    currentUserId?: string,
  ): CommentResponseDto[] {
    const commentMap = new Map<string, CommentResponseDto>();
    const rootComments: CommentResponseDto[] = [];

    comments.forEach((comment) => {
      const commentDto = this.mapCommentToDto(comment, currentUserId);
      commentMap.set(comment.id, commentDto);
    });

    comments.forEach((comment) => {
      const commentDto = commentMap.get(comment.id);

      if (!commentDto) return;

      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(commentDto);
        }
      } else {
        rootComments.push(commentDto);
      }
    });

    this.sortRepliesRecursively(rootComments);

    return rootComments;
  }

  private sortRepliesRecursively(comments: CommentResponseDto[]) {
    comments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        this.sortRepliesRecursively(comment.replies);
      }
    });
  }

  private mapCommentToDto(
    comment: any,
    currentUserId?: string,
  ): CommentResponseDto {
    const votesCount = comment.votes.reduce(
      (sum: number, vote: any) => sum + vote.value,
      0,
    );
    const userVote = currentUserId
      ? comment.votes.find((vote: any) => vote.userId === currentUserId)?.value
      : undefined;

    return {
      id: comment.id,
      content: comment.content,
      level: comment.level,
      postId: comment.postId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      author: comment.author,
      votes: comment.votes,
      replies: [],
      votesCount,
      userVote,
    };
  }
}
