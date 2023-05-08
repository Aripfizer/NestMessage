import {
  Injectable,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user: any = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotAcceptableException('Could not find the user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    let salt = bcrypt.genSaltSync(10);
    createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
    Logger.log('\n\n Pass : ' + createUserDto.password + ' \n\n');
    let createdUser = await this.prisma.user.create({ data: createUserDto });
    return {
      lastname: createdUser.lastname,
      firstname: createdUser.firstname,
      email: createdUser.email,
    };
  }
}
