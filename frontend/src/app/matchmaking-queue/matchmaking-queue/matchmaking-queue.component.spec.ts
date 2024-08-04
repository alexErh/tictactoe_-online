import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchmakingQueueComponent } from './matchmaking-queue.component';

describe('MatchmakingQueueComponent', () => {
  let component: MatchmakingQueueComponent;
  let fixture: ComponentFixture<MatchmakingQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchmakingQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchmakingQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
