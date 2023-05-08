import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MessageDto } from './dto/message-dto';

@Injectable()
export class AppService {
  constructor(@Inject('APP_MICRO') private readonly client: ClientProxy) {}

  getUserById(id: number) {
    return this.client.send({ role: 'user', cmd: 'get-by-id' }, id);
  }

  sendMessgae(messageDto: MessageDto) {
    return this.client.send({ role: 'user', cmd: 'send-message' }, messageDto);
  }

  getAllMessages(page:number, perpage:number) {
    page = page || 1;
    perpage = perpage || 10;
    return this.client.send({ cmd: 'get-all-message' }, {page, perpage});
  }
}
