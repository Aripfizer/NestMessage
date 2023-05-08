import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { IRequest } from './model';
import { MessageDto } from './dto/message-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Post('messages')
  getProfile(@Request() req: IRequest, @Body() messageDto: MessageDto) {
    messageDto.user = req.user;
    return this.appService.sendMessgae(messageDto);
  }

  @UseGuards(AuthGuard)
  @Get('messages')
  getMessages(
    @Query() params: any
  ) {
   
    return this.appService.getAllMessages(params.page, params.perpage);
  }
}
