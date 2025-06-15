import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UploadedFile,
  Delete,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { Prisma, User } from "generated/prisma";
import { ImageUpload } from "src/decorators/file-upload.decorator";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ImageUpload("image")
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.boardsService.create(createBoardDto, user.id, file);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new HttpException(
            "Board with this slug already exists",
            HttpStatus.CONFLICT,
          );
        }
      }

      throw new HttpException(
        "Failed to create board",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get()
  async findAll() {
    return this.boardsService.findAll();
  }

  @Public()
  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const board = await this.boardsService.findOne(slug);
    if (!board) {
      throw new HttpException("Board not found", HttpStatus.NOT_FOUND);
    }
    return board;
  }

  @Post(":boardSlug/join")
  async addMember(@Param("boardSlug") slug: string, @CurrentUser() user: User) {
    try {
      return await this.boardsService.addMember(slug, user.id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new HttpException(
            "User is already a member of this board",
            HttpStatus.CONFLICT,
          );
        }
      }

      throw new HttpException(
        "Failed to add member to board",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(":boardSlug/leave")
  async removeMember(
    @Param("boardSlug") slug: string,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.boardsService.removeMember(slug, user.id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new HttpException(
            "User is not a member of this board",
            HttpStatus.CONFLICT,
          );
        }
      }

      throw new HttpException(
        "Failed to remove member from board",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":boardSlug")
  async deleteBoard(
    @Param("boardSlug") slug: string,
    @CurrentUser() user: User,
  ) {
    try {
      await this.boardsService.deleteBoard(slug, user.id);
      return { message: "Board deleted successfully" };
    } catch (e) {
      if (e.message === "Board not found") {
        throw new HttpException("Board not found", HttpStatus.NOT_FOUND);
      }

      if (e.message === "User is not a member of this board") {
        throw new HttpException(
          "You are not a member of this board",
          HttpStatus.FORBIDDEN,
        );
      }

      if (e.message === "Only board administrators can delete the board") {
        throw new HttpException(
          "Only board administrators can delete the board",
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(
        "Failed to delete board",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
