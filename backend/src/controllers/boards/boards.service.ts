import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBoardDto } from "../../models";
import { R2UploadService } from "src/services/r2-upload.service";

@Injectable()
export class BoardsService {
  constructor(
    private prisma: PrismaService,
    private r2UploadService: R2UploadService,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    ownerId: string,
    file?: Express.Multer.File,
  ) {
    let attachmentUrl: string | null = null;
    if (file) {
      attachmentUrl = await this.r2UploadService.uploadFile(file, "boards");
    }

    return this.prisma.$transaction(async (prisma) => {
      const board = await prisma.board.create({
        data: {
          name: createBoardDto.name,
          description: createBoardDto.description,
          slug: createBoardDto.slug,
          image: attachmentUrl,
        },
      });

      await prisma.boardMember.create({
        data: {
          boardId: board.id,
          userId: ownerId,
          role: 0,
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

  async addMember(slug: string, userId: string, role: number = 1) {
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

  async removeMember(slug: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    return this.prisma.boardMember.delete({
      where: {
        userId_boardId: {
          boardId: board.id,
          userId,
        },
      },
    });
  }

  async deleteBoard(slug: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    if (board.members.length === 0) {
      throw new Error("User is not a member of this board");
    }

    const userMembership = board.members[0];
    if (userMembership.role !== 0) {
      throw new Error("Only board administrators can delete the board");
    }

    return this.prisma.board.delete({
      where: { slug },
    });
  }
}
