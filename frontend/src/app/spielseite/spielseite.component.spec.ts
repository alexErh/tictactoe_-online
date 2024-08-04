import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpielseiteComponent } from './spielseite.component';

describe('SpielseiteComponent', () => {
  let component: SpielseiteComponent;
  let fixture: ComponentFixture<SpielseiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpielseiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpielseiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
