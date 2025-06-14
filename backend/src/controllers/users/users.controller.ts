import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { CreateUserDto, LoginDto } from "../../models";
import { UsersService } from "./users.service";
import { Public } from "../../auth/public.decorator";
import { Prisma, User } from "generated/prisma";
import { CurrentUser } from "src/auth";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post("/register")
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new HttpException(
            "User with this email already exists",
            HttpStatus.CONFLICT,
          );
        }
      }

      throw new HttpException(
        "Failed to create user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.usersService.login(loginDto);
    } catch {
      throw new HttpException("Failed to log in user", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get("/me")
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
