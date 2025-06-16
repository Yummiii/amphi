import { Prisma } from "generated/prisma";
import {
  BaseException,
  ConflictException,
  NotFoundException,
  ValidationException,
} from "../exceptions/base.exception";

export class ErrorHandlerUtil {
  static handlePrismaError(error: any, context: string = "Operation"): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          const field = error.meta?.target as string[];
          const fieldName = field ? field[0] : "field";
          throw new ConflictException(
            `${context} failed: ${fieldName} already exists`,
            error.code,
          );
        case "P2025":
          throw new NotFoundException(context, error.code);
        case "P2003":
          throw new ValidationException(
            `${context} failed: Invalid reference`,
            error.code,
          );
        default:
          throw new BaseException(`${context} failed`, 500, error.code);
      }
    }

    throw new BaseException(`${context} failed`);
  }

  static async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: string = "Operation",
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, context);
      }

      throw new BaseException(`${context} failed`);
    }
  }
}
