import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/tables/GameEntity';
import { User } from 'src/database/tables/User';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGameDto';
import { UpdateGameDto } from './dto/updateGameDto';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getAllUserGames(nickname: string): Promise<GameEntity[]> {
        const user: User =  await this.userRepository.findOne({ where: { nickname: nickname} });
        if (!user)
            throw new NotFoundException(`There is no user with nickname ${nickname}.`);
        
        return this.gameRepository.find({
            where: [
                {player1: user},
                {player2: user}
            ],
            relations: ['player1', 'player2']
        });
    }

    async getAllActiveGames(): Promise<GameEntity[]> {
        return this.gameRepository.find({ where: { 
            player1: Not(IsNull()),
            player2: Not(IsNull()),
            winner: IsNull()
        }});
    }

    async getAllFinishedGames(): Promise<GameEntity[]> {
        return this.gameRepository.find({ where: {
            player1: Not(IsNull()),
            player2: Not(IsNull()),
            winner: Not(IsNull())
        }})
    }

    async createGame(game: CreateGameDto): Promise<GameEntity> {
        const gameEntity: GameEntity = new GameEntity();

        gameEntity.player1 = game.player1;
        gameEntity.player2 = game.player2;
        gameEntity.winner = null;

        return this.gameRepository.save(gameEntity);
    }

    async setWinner(data: UpdateGameDto): Promise<GameEntity> {
        const game: GameEntity = await this.gameRepository.findOne({ where: { id: data.id } });

        if (!game.winner || game.winner.trim() !== '')
            throw new ConflictException(`Winner already exist.`);

        game.winner = data.winner;

        return this.gameRepository.save(game);
    }
}
