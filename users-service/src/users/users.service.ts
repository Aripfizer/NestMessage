import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
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

  // async findAll() {
  //   let allUers = await this.prisma.user.findMany();
  //   return this.client.send({ role: 'user', cmd: 'get-all-users' }, allUers);
  // }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   let updatedUser = await this.prisma.user.update({
  //     where: { id },
  //     data: updateUserDto,
  //   });
  //   return this.client.send({ role: 'user', cmd: 'update-user' }, updatedUser);
  // }

  // async remove(id: number) {
  //   let deletedUser = await this.prisma.user.delete({
  //     where: { id },
  //   });
  //   return this.client.send({ role: 'user', cmd: 'delete-user' }, deletedUser);
  // }
}
