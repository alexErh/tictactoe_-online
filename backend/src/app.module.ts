import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./database/tables/User";
import { MatchGateway } from './match/match.gateway';
import { MatchService } from './match/match.service';
import { MatchmakingController } from './match/matchmaking/matchmaking.controller';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: './tmp.sqlite',
        entities: [User],
        synchronize: true,
        extra: {
          busyTimeout: 5000, // 5 Sekunden
        },
      }),
      AuthModule, 
      UsersModule, //GameModule
  ],
  controllers: [AppController, MatchmakingController],
  providers: [AppService, MatchGateway, MatchService],
})
export class AppModule {}
