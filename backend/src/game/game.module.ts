import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameEntity } from 'src/database/tables/GameEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/database/tables/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, User])
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway, UsersService]
})
export class GameModule {}
