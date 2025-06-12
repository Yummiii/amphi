export class CreatePostDto {
  title: string;
  content?: string;
  attachment?: string;
  board: string;
}

export class UpdatePostDto {
  title?: string;
  content?: string;
  attachment?: string;
}
