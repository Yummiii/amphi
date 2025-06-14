import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePostDto } from "../../models";
import { R2UploadService } from "../../services/r2-upload.service";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private r2UploadService: R2UploadService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorId: string,
    file?: Express.Multer.File,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { slug: createPostDto.board },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    let attachmentUrl: string | null = null;
    if (file) {
      attachmentUrl = await this.r2UploadService.uploadFile(file, "posts");
    }

    return this.prisma.post.create({
      data: {
        content: createPostDto.content,
        attachment: attachmentUrl,
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
