import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UploadedFile,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { User } from "generated/prisma";
import { AttachmentUpload } from "../../decorators/file-upload.decorator";
import { ErrorHandlerUtil, ResponseBuilder, ApiResponse } from "../../common";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @AttachmentUpload("attachment")
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.postsService.create(
        createPostDto,
        user.id,
        file,
      );
      return ResponseBuilder.success(result, "Post created successfully");
    }, "Create post");
  }

  @Public()
  @Get()
  async findAll(
    @Query("boardId") boardId?: number,
    @Query("authorId") authorId?: string,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      let result;
      if (boardId) {
        result = await this.postsService.findByBoard(boardId);
      } else if (authorId) {
        result = await this.postsService.findByAuthor(authorId);
      } else {
        result = await this.postsService.findAll();
      }
      return ResponseBuilder.success(result, "Posts retrieved successfully");
    }, "Get posts");
  }

  @Post(":id/upvote")
  async upvote(
    @Param("id") postId: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.postsService.vote(postId, user.id, 1);
      return ResponseBuilder.success(result, "Post upvoted successfully");
    }, "Upvote post");
  }

  @Post(":id/downvote")
  async downvote(
    @Param("id") postId: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.postsService.vote(postId, user.id, -1);
      return ResponseBuilder.success(result, "Post downvoted successfully");
    }, "Downvote post");
  }
}
