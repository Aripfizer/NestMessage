import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();
const logger = new Logger('Microservice');
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
        // port: process.env.PORT || 3002,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
}
bootstrap();
