import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as session from 'express-session';
import * as crypto from 'crypto';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ReturnUserDto } from './users/dto/returnUserDto';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: boolean;
    user?: ReturnUserDto;
  }
}

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(
    session({
      name: 'TICTACTOE_SASSION_ID',
      secret: crypto.randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TicTacToe Online')
    .setDescription('The API for the online TicTacToe game')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
