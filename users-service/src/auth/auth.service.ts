import {
  Injectable,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user: any = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotAcceptableException('Could not find the user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
