import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateUserDto,
  LoginDto,
  AuthResponseDto,
  UserProfileDto,
} from "../../models";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { User } from "generated/prisma";
import { R2UploadService } from "src/services/r2-upload.service";
import { NotFoundException, UnauthorizedException } from "../../common";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private r2UploadService: R2UploadService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ): Promise<AuthResponseDto> {
    const { tags, ...userData } = createUserDto;

    let attachmentUrl: string | null = null;
    if (file) {
      attachmentUrl = await this.r2UploadService.uploadFile(file, "users");
    }

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        avatar: attachmentUrl,
        birthdate: new Date(userData.birthdate),
        tags: tags
          ? {
              connect: tags.map((tagId) => ({ id: tagId })),
            }
          : undefined,
        pass_hash: await argon2.hash(userData.password),
      },
      include: {
        tags: true,
      },
    });

    return {
      token: await this.generateToken(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        tags: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await argon2.verify(
      user.pass_hash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return {
      token: await this.generateToken(user),
    };
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        birthdate: true,
        avatar: true,
        createdAt: true,
        tags: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        boards: {
          select: {
            role: true,
            createdAt: true,
            board: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                createdAt: true,
              },
            },
          },
        },
        posts: {
          select: {
            id: true,
            content: true,
            attachment: true,
            createdAt: true,
            board: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            level: true,
            createdAt: true,
            post: {
              select: {
                id: true,
                content: true,
                board: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User");
    }

    return user;
  }

  private async generateToken(user: User): Promise<string> {
    return this.jwtService.signAsync({
      id: user.id,
      nonce: uuidv4(),
    });
  }
}
