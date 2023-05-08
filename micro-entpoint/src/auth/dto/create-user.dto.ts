import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/Validator/custom-rugles';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsUnique('user', 'email', {
    message: 'Cette adresse email est deja utiliser',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[a-z]/, {
    message: 'Le mot de passe doit comporter au moins une lettre minuscule',
  })
  @Matches(/[A-Z]/, {
    message: 'Le mot de passe doit comporter au moins une lettre majuscule',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit comporter au moins un chiffre',
  })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Le mot de passe doit comporter au moins un caractère spécial',
  })
  password: string;
}
