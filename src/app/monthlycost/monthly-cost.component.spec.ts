import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCostComponent } from './monthly-cost.component';

describe('MonthlyCostComponent', () => {
  let component: MonthlyCostComponent;
  let fixture: ComponentFixture<MonthlyCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
