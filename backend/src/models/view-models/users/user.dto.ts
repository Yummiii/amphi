import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email address.' })
  email: string;
  username: string;
  birthdate: string;
  avatar?: string;
  tags?: string[];
  password: string;
}

export class UpdateUserDto {
  email?: string;
  username?: string;
  birthdate?: string;
  avatar?: string;
  tags?: string[];
}
