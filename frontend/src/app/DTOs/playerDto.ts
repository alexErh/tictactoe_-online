export type CellValue = 'X' | 'O' | null;

export interface PlayerDto {
  clientId: string;
  nickname: string;
  score: number;
  symbol: 'X' | 'O';
}