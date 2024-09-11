import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './database/tables/User';
import { MatchGateway } from './match/match.gateway';
import { MatchService } from './match/match.service';
import { GameModule } from './game/game.module';
import { GameEntity } from './database/tables/GameEntity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, GameEntity],
      synchronize: true,
      extra: {
        busyTimeout: 5000, // 5 Sekunden
      },
    }),
    AuthModule,
    UsersModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, MatchGateway, MatchService],
})
export class AppModule {}
