import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [PrismaModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
