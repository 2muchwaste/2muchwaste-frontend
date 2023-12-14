import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyEmptyingComponent } from './monthly-emptying.component';

describe('MonthlyEmptyingComponent', () => {
  let component: MonthlyEmptyingComponent;
  let fixture: ComponentFixture<MonthlyEmptyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyEmptyingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyEmptyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
