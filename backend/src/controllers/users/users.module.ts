import { Module } from "@nestjs/common";
import { JwtImport } from "src/auth/constants";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { R2UploadService } from "src/services/r2-upload.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, R2UploadService],
  exports: [UsersService],
  imports: [JwtImport],
})
export class UsersModule {}
