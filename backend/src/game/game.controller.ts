import {Body, Controller, Param, Post} from '@nestjs/common';
import {GameService} from "./game.service";
import {CreateGameDto} from "./dto/createGameDto";
import {Game} from "./Game";
import {Public} from "../auth/public.decorator";


@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Public()
    @Post('create')
    createGame(@Body() createGameDto: CreateGameDto): Game {
        return this.gameService.createGame(createGameDto.player1, createGameDto.player2);
    }

    @Post(':id/move')
    makeMove(
        @Param('id') gameId: number,
        @Body('position') position: number,
        @Body('player') player: string
    ) {
        return this.gameService.makeMove(gameId, position, player);
    }


}
