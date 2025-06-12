import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { User } from "generated/prisma";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.postsService.create(createPostDto, user.id);
    } catch (error) {
      console.log(error);

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

  @Post(":id/vote")
  async vote(
    @Param("id") postId: string,
    @Body() voteData: { value: number },
    @CurrentUser() user: User,
  ) {
    try {
      return await this.postsService.vote(postId, user.id, voteData.value);
    } catch {
      throw new HttpException(
        "Failed to vote on post",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
