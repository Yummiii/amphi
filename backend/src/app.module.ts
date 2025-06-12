import { Module } from "@nestjs/common";
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./controllers/users/users.module";
import { PostsModule } from "./controllers/posts/posts.module";
import { BoardsModule } from "./controllers/boards/boards.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PostsModule, BoardsModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
