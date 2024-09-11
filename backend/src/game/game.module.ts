import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
<<<<<<< HEAD
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
=======
import { GameGateway } from './game.gateway';

@Module({
  providers: [GameService, GameGateway],
  controllers: [GameController]
>>>>>>> main
})
export class GameModule {}
