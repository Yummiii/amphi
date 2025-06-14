import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBoardDto } from "../../models";

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto, ownerId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const board = await prisma.board.create({
        data: createBoardDto,
      });

      await prisma.boardMember.create({
        data: {
          boardId: board.id,
          userId: ownerId,
          role: 1,
        },
      });

      return board;
    });
  }

  async findAll() {
    return this.prisma.board.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            members: true,
          },
        },
      },
    });
  }

  async findOne(slug: string) {
    return this.prisma.board.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                comments: true,
                votes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            members: true,
          },
        },
      },
    });
  }

  async addMember(slug: string, userId: string, role: number = 0) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    return this.prisma.boardMember.create({
      data: {
        boardId: board.id,
        userId,
        role,
      },
    });
  }
}
