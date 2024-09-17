import { CellValue, PlayerDto } from "./playerDto";

export interface GameStatusDto {
    id: string;
    player1: PlayerDto;
    player2: PlayerDto;
    nextPlayer: string;
    winner: string | null;
    board: CellValue[];
  }