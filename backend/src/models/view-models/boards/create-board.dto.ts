import { IsString, Length } from "class-validator";

export class CreateBoardDto {
  name: string;
  @IsString()
  @Length(3, 32, { message: "Slug must be between 3 and 32 characters." })
  slug: string;
  description?: string;
  image?: string;
}
