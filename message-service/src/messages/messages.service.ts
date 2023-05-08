import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return await this.prisma.message.create({
      data: {
        authorId: createMessageDto.user.id,
        content: createMessageDto.content,
      },
    });
  }

  async findAll(page: number, perpage: number) {
    const skip = (page - 1) * perpage;
    return await this.prisma.message.findMany({
      select: {
        content: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(perpage),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
