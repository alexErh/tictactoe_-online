import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilseiteComponent } from './profilseite.component';

describe('ProfilseiteComponent', () => {
  let component: ProfilseiteComponent;
  let fixture: ComponentFixture<ProfilseiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilseiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilseiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
