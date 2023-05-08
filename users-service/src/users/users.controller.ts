import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ role: 'user', cmd: 'create' })
  @Post()
  create(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.findOne(id);
  // }
  @MessagePattern({ role: 'user', cmd: 'get-by-id' })
  findOne(id: number) {
    return this.usersService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.remove(id);
  // }
}
