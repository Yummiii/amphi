export class CreatePostDto {
  content: string;
  board: string;
}

export class UpdatePostDto {
  title?: string;
  content?: string;
  attachment?: string;
}
