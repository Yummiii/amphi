import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBoardDto } from "../../models";
import { R2UploadService } from "src/services/r2-upload.service";
import { NotFoundException, ForbiddenException } from "../../common";

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
        include: {
          _count: {
            select: {
              posts: true,
              members: true,
            },
          },
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(slug: string) {
    const board = await this.prisma.board.findUnique({
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
            votes: {
              select: {
                value: true,
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

    if (!board) {
      throw new NotFoundException("Board");
    }

    const postsWithScore = board.posts.map((post) => {
      const score = post.votes.reduce((sum, vote) => sum + vote.value, 0);
      const { votes, ...postWithoutVotes } = post;
      return {
        ...postWithoutVotes,
        score,
      };
    });

    return {
      ...board,
      posts: postsWithScore,
    };
  }

  async addMember(slug: string, userId: string, role: number = 1) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) {
      throw new NotFoundException("Board");
    }

    return this.prisma.boardMember.create({
      data: {
        boardId: board.id,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async removeMember(slug: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) {
      throw new NotFoundException("Board");
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
      throw new NotFoundException("Board");
    }

    if (board.members.length === 0) {
      throw new ForbiddenException("You are not a member of this board");
    }

    const userMembership = board.members[0];
    if (userMembership.role !== 0) {
      throw new ForbiddenException(
        "Only board administrators can delete the board",
      );
    }

    return this.prisma.board.delete({
      where: { slug },
    });
  }
}
