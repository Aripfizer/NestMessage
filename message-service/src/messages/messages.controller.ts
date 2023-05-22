import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @EventPattern({ role: 'user', cmd: 'send-message' })
  create(createMessageDto: CreateMessageDto) {
    Logger.log('\n\n ' + CreateMessageDto + ' \n\n');

    return this.messagesService.create(createMessageDto);
  }

  @MessagePattern({ cmd: 'get-all-message' })
  findAll({ page, perpage }) {
    return this.messagesService.findAll(page, perpage);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
