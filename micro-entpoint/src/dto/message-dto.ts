import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/Validator/custom-rugles';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  content: string;

  @IsOptional()
  user?: any

}
