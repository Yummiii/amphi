import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Observable } from "rxjs";

export interface FileUploadOptions {
  fieldName?: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  required?: boolean;
}

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly interceptor: NestInterceptor;

  constructor(private readonly options: FileUploadOptions = {}) {
    const {
      fieldName = "file",
      maxFileSize = 10 * 1024 * 1024,
      allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"],
    } = options;

    this.interceptor = new (FileInterceptor(fieldName, {
      limits: {
        fileSize: maxFileSize,
      },
      fileFilter: (req, file, callback) => {
        if (
          !allowedMimeTypes.some((type) =>
            file.mimetype.match(new RegExp(type.replace("*", ".*"))),
          )
        ) {
          return callback(
            new BadRequestException(
              `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
            ),
            false,
          );
        }

        const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
        if (fileExtension && !allowedExtensions.includes(fileExtension)) {
          return callback(
            new BadRequestException(
              `Invalid file extension. Allowed extensions: ${allowedExtensions.join(", ")}`,
            ),
            false,
          );
        }

        callback(null, true);
      },
    }))();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return this.interceptor.intercept(context, next);
  }
}
