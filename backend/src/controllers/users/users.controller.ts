import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Param,
} from "@nestjs/common";
import { CreateUserDto, LoginDto, UserProfileDto } from "../../models";
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

  @Public()
  @Get("/:id")
  async getUserProfile(@Param("id") id: string): Promise<UserProfileDto> {
    try {
      const userProfile = await this.usersService.getUserProfile(id);

      if (!userProfile) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      return userProfile;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new HttpException(
        "Failed to get user profile",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
