import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  Delete,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { User } from "generated/prisma";
import { ImageUpload } from "src/decorators/file-upload.decorator";
import { ErrorHandlerUtil, ResponseBuilder, ApiResponse } from "../../common";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ImageUpload("image")
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.boardsService.create(
        createBoardDto,
        user.id,
        file,
      );
      return ResponseBuilder.success(result, "Board created successfully");
    }, "Create board");
  }

  @Public()
  @Get()
  async findAll(): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.boardsService.findAll();
      return ResponseBuilder.success(result, "Boards retrieved successfully");
    }, "Get boards");
  }

  @Public()
  @Get(":slug")
  async findOne(@Param("slug") slug: string): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.boardsService.findOne(slug);
      return ResponseBuilder.success(result, "Board retrieved successfully");
    }, "Get board");
  }

  @Post(":boardSlug/join")
  async addMember(
    @Param("boardSlug") slug: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.boardsService.addMember(slug, user.id);
      return ResponseBuilder.success(result, "Successfully joined board");
    }, "Join board");
  }

  @Post(":boardSlug/leave")
  async removeMember(
    @Param("boardSlug") slug: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.boardsService.removeMember(slug, user.id);
      return ResponseBuilder.success(result, "Successfully left board");
    }, "Leave board");
  }

  @Delete(":boardSlug")
  async deleteBoard(
    @Param("boardSlug") slug: string,
    @CurrentUser() user: User,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      await this.boardsService.deleteBoard(slug, user.id);
      return ResponseBuilder.success(null, "Board deleted successfully");
    }, "Delete board");
  }
}
