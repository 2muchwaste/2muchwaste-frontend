import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatebinComponent } from './statebin.component';

describe('StatebinComponent', () => {
  let component: StatebinComponent;
  let fixture: ComponentFixture<StatebinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatebinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatebinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
