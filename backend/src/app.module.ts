import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./database/tables/User";
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { GameTable } from './database/tables/Game';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: './tmp.sqlite',
        entities: [User, GameTable],
        synchronize: true,
      }),
      AuthModule, 
      UsersModule, 
      GameModule
  ],
  controllers: [AppController, GameController],
  providers: [AppService],
})
export class AppModule {}
