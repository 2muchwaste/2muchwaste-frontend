import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrowgarbageComponent } from './throwgarbage.component';

describe('ThrowgarbageComponent', () => {
  let component: ThrowgarbageComponent;
  let fixture: ComponentFixture<ThrowgarbageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThrowgarbageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThrowgarbageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
