import {Board} from "./Board";


export interface Game {
    id: number;
    player1: string; //nickname of user
    player2: string;
    board: Board;
    currentTurn: string;
    winner: string | null;
}

