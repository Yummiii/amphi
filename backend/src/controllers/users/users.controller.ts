import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
} from "@nestjs/common";
import { CreateUserDto, LoginDto, UserProfileDto } from "../../models";
import { UsersService } from "./users.service";
import { Public } from "../../auth/public.decorator";
import { User } from "generated/prisma";
import { CurrentUser } from "src/auth";
import { ImageUpload } from "src/decorators/file-upload.decorator";
import { ErrorHandlerUtil, ResponseBuilder, ApiResponse } from "../../common";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post("/register")
  @ImageUpload("avatar")
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.usersService.create(createUserDto, file);
      return ResponseBuilder.success(result, "User created successfully");
    }, "User registration");
  }

  @Public()
  @Post("/login")
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const result = await this.usersService.login(loginDto);
      return ResponseBuilder.success(result, "Login successful");
    }, "User login");
  }

  @Get("/me")
  getCurrentUser(@CurrentUser() user: User): ApiResponse<User> {
    return ResponseBuilder.success(user, "Current user retrieved");
  }

  @Public()
  @Get("/:id")
  async getUserProfile(
    @Param("id") id: string,
  ): Promise<ApiResponse<UserProfileDto>> {
    return ErrorHandlerUtil.executeWithErrorHandling(async () => {
      const userProfile = await this.usersService.getUserProfile(id);
      return ResponseBuilder.success(userProfile, "User profile retrieved");
    }, "Get user profile");
  }
}
