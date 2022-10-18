import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorhomeComponent } from './operatorhome.component';

describe('OperatorhomeComponent', () => {
  let component: OperatorhomeComponent;
  let fixture: ComponentFixture<OperatorhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorhomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
