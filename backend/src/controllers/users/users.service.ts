import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto, LoginDto, AuthResponseDto } from "../../models";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { User } from "generated/prisma";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { tags, ...userData } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
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
      throw new Error("User not found");
    }

    const isPasswordValid = await argon2.verify(
      user.pass_hash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      token: await this.generateToken(user),
    };
  }

  async generateToken(user: User): Promise<string> {
    return this.jwtService.signAsync({
      id: user.id,
      nonce: uuidv4(),
    });
  }
}
