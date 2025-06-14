import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { R2UploadService } from "../../services/r2-upload.service";

@Module({
  controllers: [PostsController],
  providers: [PostsService, R2UploadService],
  exports: [PostsService],
})
export class PostsModule {}
