import { Module } from "@nestjs/common";
import { JwtImport } from "src/auth/constants";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [JwtImport],
})
export class UsersModule {}
