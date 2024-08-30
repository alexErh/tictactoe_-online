import { TestBed } from '@angular/core/testing';

import { MatchmakingQueueService } from './matchmaking-queue.service';

describe('MatchmakingQueueService', () => {
  let service: MatchmakingQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchmakingQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
