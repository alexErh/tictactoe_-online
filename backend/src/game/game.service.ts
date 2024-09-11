import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/tables/GameEntity';
import { User } from 'src/database/tables/User';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGameDto';
import { UpdateGameWinnerDto } from './dto/updateGameWinnerDto';
import { ReturnGameDto } from './dto/returnGameDto';
import { ReturnUserDto } from 'src/users/dto/returnUserDto';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getAllUserGames(nickname: string): Promise<ReturnGameDto[]> {
        const user: User =  await this.userRepository.findOne({ where: { nickname: nickname} });
        if (!user)
            throw new NotFoundException(`There is no user with nickname ${nickname}.`);
        
        return (await this.gameRepository.find({
            where: [
                {player1: user},
                {player2: user}
            ],
            relations: ['player1', 'player2']
        })).map(e => {
            return this.returnGame(e);
        });
    }

    async getAllActiveGames(): Promise<ReturnGameDto[]> {
        return (await this.gameRepository.find({ where: { 
            player1: Not(IsNull()),
            player2: Not(IsNull()),
            winner: IsNull()
        }})).map(e => {
            return this.returnGame(e);
        });
    }

    async createGame(data: CreateGameDto): Promise<ReturnGameDto> {
        const player1 = await this.userRepository.findOne({ where: { nickname: data.player1 }});
        const player2 = await this.userRepository.findOne({ where: { nickname: data.player2 }});
        const e: GameEntity = new GameEntity()
        e.player1 = player1;
        e.player2 = player2;
        const newGame = await this.gameRepository.save(e);
        return this.returnGame(newGame);
    }

    async setWinner(data: UpdateGameWinnerDto): Promise<ReturnGameDto> {
        const game = await this.gameRepository.findOne({ where: { id: data.id }});
        if(game.winner.trim().length <= 0)
            throw new ConflictException(`Winner already exist.`);

        game.winner = data.winner;
        const updatedGame = await this.gameRepository.save(game);
        return this.returnGame(updatedGame);
    }

    private returnGame(game: GameEntity): ReturnGameDto {
        const player1 = new ReturnUserDto();
        player1.id = game.player1.id;
        player1.nickname = game.player1.nickname;
        player1.score = game.player1.score;
        player1.img = game.player1.img.toString('base64');

        const player2 = new ReturnUserDto();
        player2.id = game.player2.id;
        player2.nickname = game.player2.nickname;
        player2.score = game.player2.score;
        player2.img = game.player2.img.toString('base64');
        return {
            id: game.id,
            player1: player1,
            player2: player2,
            winner: game.winner
        }
    }
}
