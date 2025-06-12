import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtImport } from "./constants";

@Module({
  imports: [JwtImport, PrismaModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
