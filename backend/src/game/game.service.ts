import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/tables/GameEntity';
import { User } from 'src/database/tables/User';
import { Repository } from 'typeorm';
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

    async createGame(game: CreateGameDto): Promise<GameEntity> {
        const gameTable: GameEntity = new GameEntity();

        gameTable.player1 = game.player1;
        gameTable.player2 = game.player2;

        return this.gameRepository.save(gameTable);
    }

    async setWinner(data: UpdateGameDto): Promise<GameEntity> {
        const game: GameEntity = await this.gameRepository.findOne({ where: { id: data.id } });

        if (!game.winner || game.winner.trim() !== '')
            throw new ConflictException(`Winner already exist.`);

        game.winner = data.winner;

        return this.gameRepository.save(game);
    }
}
