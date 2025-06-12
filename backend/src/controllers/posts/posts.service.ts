import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePostDto } from "../../models";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const board = await this.prisma.board.findUnique({
      where: { slug: createPostDto.board },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        attachment: createPostDto.attachment,
        boardId: board.id,
        authorId,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        board: {
          select: {
            id: true,
            name: true,
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
    });
  }

  async findByBoard(boardId: number) {
    return this.prisma.post.findMany({
      where: { boardId },
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
    });
  }

  async findByAuthor(authorId: string) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        board: {
          select: {
            id: true,
            name: true,
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
    });
  }

  async vote(postId: string, userId: string, value: number) {
    return this.prisma.postVote.upsert({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      update: {
        value,
      },
      create: {
        postId,
        userId,
        value,
      },
    });
  }
}
