import { applyDecorators, UseInterceptors } from "@nestjs/common";
import {
  FileUploadInterceptor,
  FileUploadOptions,
} from "../interceptors/file-upload.interceptor";

export function FileUpload(options: FileUploadOptions = {}) {
  return applyDecorators(UseInterceptors(new FileUploadInterceptor(options)));
}

export function ImageUpload(
  fieldName = "image",
  maxFileSize = 5 * 1024 * 1024,
) {
  return FileUpload({
    fieldName,
    maxFileSize,
    allowedMimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
  });
}

export function AttachmentUpload(
  fieldName = "attachment",
  maxFileSize = 50 * 1024 * 1024,
) {
  return FileUpload({
    fieldName,
    maxFileSize,
    allowedMimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mpeg",
    ],
    allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mpeg"],
  });
}
