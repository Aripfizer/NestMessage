import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APP_MICRO',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService],
})
export class AuthModule {}
