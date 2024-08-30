import assert from "assert";

export class Board {
    gameBoard: CellValue[];

    private static WINNING_COMBI: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    constructor() {
        this.gameBoard = Array(9).fill(null);
    }


    getBoard(): CellValue[] {
        return this.gameBoard;
    }

    resetBoard(): void {
        this.gameBoard = Array(9).fill(null);
    }

    makeMove(position: number, player: 'X' | 'O'): boolean {
        assert(position >= 0 && position <= 8, 'Position must be between 0 and 8');
        if (this.gameBoard[position] === null) {
            this.gameBoard[position] = player;
            return true;
        }
        return false;
    }
    threeInARow(): CellValue {
        for (const combo of Board.WINNING_COMBI) {
            const [a, b, c] = combo;
            if (this.gameBoard[a] !== null &&
                this.gameBoard[a] === this.gameBoard[b] &&
                this.gameBoard[a] === this.gameBoard[c]) {
                return this.gameBoard[a];
            }
        }
        return null;
    }
    isDraw(): boolean {
        return !this.gameBoard.some((cell) => cell === null)
            && this.threeInARow() === null;
    }


}