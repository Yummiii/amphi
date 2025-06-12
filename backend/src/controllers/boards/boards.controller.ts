import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "../../models";
import { CurrentUser } from "../../auth/current-user.decorator";
import { Public } from "../../auth/public.decorator";
import { Prisma, User } from "generated/prisma";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.boardsService.create(createBoardDto, user.id);
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
  @Get(":id")
  async findOne(@Param("id") id: number) {
    const board = await this.boardsService.findOne(id);
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
}
