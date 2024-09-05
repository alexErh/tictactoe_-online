import { Injectable } from '@nestjs/common';
import {Board} from "./Board";
import {Game} from "./Game"
@Injectable()
export class GameService {
    private games: Game[] = [];
    private nextGameId = 0;


    createGame(player1: string, player2: string): Game {
        const startingPlayer = Math.random() < 0.5 ? player1 : player2;
        const newGame: Game = {
            id: this.nextGameId++,
            player1,
            player2,
            board: new Board(),
            currentTurn: startingPlayer,
            winner: null
        };
        this.games.push(newGame);
        console.log("games ", this.games);
        return newGame;
    }
    findGame(gameId: number): Game | undefined {
        return this.games.find(game => game.id === gameId);
    }

    makeMove(gameId: number, position: number, playerName: string): boolean {
        const game = this.findGame(gameId);
        if (!game || game.winner || game.currentTurn !== playerName) {
            return false;
        }

        const playerSymbol: 'X' | 'O' = game.player1 === playerName ? 'X' : 'O';

        const moveMade = game.board.makeMove(position, playerSymbol);
        if (!moveMade) {
            return false;
        }

        const winner = game.board.threeInARow();
        if (winner) {
            game.winner = playerName;
        } else if (game.board.isDraw()) {
            game.winner = 'Draw';
        } else {
            game.currentTurn = game.currentTurn === game.player1 ? game.player2 : game.player1;
        }

        return true;
    }

}
