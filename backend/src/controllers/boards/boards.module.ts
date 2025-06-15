import { Module } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { BoardsController } from "./boards.controller";
import { R2UploadService } from "src/services/r2-upload.service";

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, R2UploadService],
  exports: [BoardsService],
})
export class BoardsModule {}
