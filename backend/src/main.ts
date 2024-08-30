import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as session from 'express-session';
import * as crypto from 'crypto';

declare module "express-session" {
    interface SessionData {
        isLoggedIn?: boolean;
        user?: { nickname: string };
    }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
      session({
        secret: crypto.randomBytes(32).toString('hex'),
        resave: false,
        saveUninitialized: false,
      }),
  );
  const config = new DocumentBuilder()
      .setTitle('TicTacToe Online')
      .setDescription('The API for the online TicTacToe game')
      .setVersion('1.0')
      .addTag('TicTacToe')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
