import { TestBed } from '@angular/core/testing';
import { GameEndedService } from './game-ended.service';

describe('GameEndedService', () => {
  let service: GameEndedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEndedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
