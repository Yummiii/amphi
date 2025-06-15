import { IsEmail } from "class-validator";
import { Board, BoardMember, Post, Comment } from "generated/prisma";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email address." })
  email: string;
  username: string;
  birthdate: string;
  tags?: string[];
  password: string;
}

export class UserProfileDto {
  id: string;
  email: string;
  username: string;
  birthdate: Date;
  avatar: string | null;
  createdAt: Date;
}
