import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorInformationComponent } from './operator-information.component';

describe('OperatorInformationComponent', () => {
  let component: OperatorInformationComponent;
  let fixture: ComponentFixture<OperatorInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
