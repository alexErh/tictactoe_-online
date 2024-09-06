export class Board {
  private gameBoard: CellValue[];

  private static WINNING_COMBI: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  constructor(board: CellValue[]) {
    this.gameBoard = board;
  }

  getBoard(): CellValue[] {
    return this.gameBoard;
  }

  threeInARow(): CellValue {
    for (const combo of Board.WINNING_COMBI) {
      const [a, b, c] = combo;
      if (
        this.gameBoard[a] !== null &&
        this.gameBoard[a] === this.gameBoard[b] &&
        this.gameBoard[a] === this.gameBoard[c]
      ) {
        return this.gameBoard[a];
      }
    }
    return null;
  }
  isDraw(): boolean {
    return (
      !this.gameBoard.some((cell) => cell === null) &&
      this.threeInARow() === null
    );
  }
}
