import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlycostComponent } from './monthlycost.component';

describe('MonthlycostComponent', () => {
  let component: MonthlycostComponent;
  let fixture: ComponentFixture<MonthlycostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlycostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlycostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
