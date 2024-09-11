import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should make a move and print the board', () => {
    service.makeMove(0, 'X');
    const board = service.getBoard();
    console.log('Board after X move:', board);
    expect(board[0]).toBe('X');
  });
  it("", () => {
    service.makeMove(0, 'X');
    service.makeMove(1, 'O');
    service.makeMove(2, 'X');
    service.makeMove(3, 'X');
    service.makeMove(4, 'O');
    service.makeMove(5, 'O');
    service.makeMove(6, 'O');
    service.makeMove(7, 'X');
    service.makeMove(8, 'X');

    const board = service.getBoard();
    console.log('board: ', board);
    console.log('three in a row',service.isDraw());
  })
});
