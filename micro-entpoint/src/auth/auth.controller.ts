import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { IRequest } from 'src/model';



@Controller('auth')
export class AuthController {
  constructor(
    @Inject('APP_MICRO') private readonly client: ClientProxy,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.client.send({ role: 'user', cmd: 'create' }, createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: IRequest) {
    let user = req.user;
    return {
      lastname: user.lastname,
      firstname: user.firstname,
      email: user.email,
    };
  }
}
