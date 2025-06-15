import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import {
  CreateCommentDto,
  CommentTreeResponseDto,
  CommentResponseDto,
} from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { User } from "generated/prisma";
import { ErrorHandlerUtil, ResponseBuilder, ApiResponse } from "../../common";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<CommentResponseDto>> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.commentsService.create(
        createCommentDto,
        user.id,
      );
      return ResponseBuilder.success(result, "Comment created successfully");
    }, "Create comment");
  }

  @Public()
  @Get("post/:postId")
  async getCommentsByPost(
    @Param("postId") postId: string,
    @CurrentUser() user?: User,
  ): Promise<ApiResponse<CommentTreeResponseDto>> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.commentsService.getCommentsByPost(
        postId,
        user?.id,
      );
      return ResponseBuilder.success(result, "Comments retrieved successfully");
    }, "Get comments");
  }

  @Post(":id/upvote")
  async upvote(
    @Param("id") commentId: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<CommentResponseDto>> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.commentsService.voteOnComment(
        commentId,
        user.id,
        1,
      );
      return ResponseBuilder.success(result, "Comment upvoted successfully");
    }, "Upvote comment");
  }

  @Post(":id/downvote")
  async downvote(
    @Param("id") commentId: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<CommentResponseDto>> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.commentsService.voteOnComment(
        commentId,
        user.id,
        -1,
      );
      return ResponseBuilder.success(result, "Comment downvoted successfully");
    }, "Downvote comment");
  }
}
