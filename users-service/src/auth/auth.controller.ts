import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';

interface IRequest extends Request {
  user: any;
}

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ role: 'user', cmd: 'login' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @MessagePattern({ role: 'user', cmd: 'register' })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @MessagePattern({ role: 'user', cmd: 'profile' })
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
