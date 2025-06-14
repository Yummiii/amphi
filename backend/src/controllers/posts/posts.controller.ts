import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query,
  UploadedFile,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { User } from "generated/prisma";
import { AttachmentUpload } from "../../decorators/file-upload.decorator";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @AttachmentUpload("attachment")
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.postsService.create(createPostDto, user.id, file);
    } catch (error) {
      if (error.message && error.message.includes("Invalid file")) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        "Failed to create post",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get()
  async findAll(
    @Query("boardId") boardId?: number,
    @Query("authorId") authorId?: string,
  ) {
    if (boardId) {
      return this.postsService.findByBoard(boardId);
    }
    if (authorId) {
      return this.postsService.findByAuthor(authorId);
    }
    return this.postsService.findAll();
  }

  @Post(":id/upvote")
  async vote(@Param("id") postId: string, @CurrentUser() user: User) {
    try {
      return await this.postsService.vote(postId, user.id, 1);
    } catch {
      throw new HttpException(
        "Failed to vote on post",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(":id/downvote")
  async downvote(@Param("id") postId: string, @CurrentUser() user: User) {
    try {
      return await this.postsService.vote(postId, user.id, -1);
    } catch {
      throw new HttpException(
        "Failed to downvote post",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
