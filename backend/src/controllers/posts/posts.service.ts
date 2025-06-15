import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePostDto } from "../../models";
import { R2UploadService } from "../../services/r2-upload.service";
import { NotFoundException } from "../../common";

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
      throw new NotFoundException('Board');
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
            slug: true,
          },
        },
      },
    });
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
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
            slug: true,
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
    });

    return this.transformPostsWithScore(posts);
  }

  async findByBoard(boardId: number) {
    const posts = await this.prisma.post.findMany({
      where: { boardId },
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
            slug: true,
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
    });

    return this.transformPostsWithScore(posts);
  }

  async findByAuthor(authorId: string) {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
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
            slug: true,
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
    });

    return this.transformPostsWithScore(posts);
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

  private transformPostsWithScore(posts: any[]) {
    return posts.map((post) => {
      const score = post.votes.reduce((sum: number, vote: any) => sum + vote.value, 0);
      const { votes, ...postWithoutVotes } = post;
      return {
        ...postWithoutVotes,
        score,
      };
    });
  }
}
