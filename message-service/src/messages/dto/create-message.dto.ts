import { IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    content: string;
  
    @IsOptional()
    user?: any
}
