import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameEntity } from 'src/database/tables/GameEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/database/tables/User';
import { MatchService } from 'src/match/match.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, User])
  ],
  controllers: [GameController],
  providers: [GameService, UsersService, MatchService],
  exports: [GameService, TypeOrmModule],
})
export class GameModule {}
