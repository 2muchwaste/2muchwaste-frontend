import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDepositsInformationComponent } from './user-deposits-information.component';

describe('UserDepositsInformationComponent', () => {
  let component: UserDepositsInformationComponent;
  let fixture: ComponentFixture<UserDepositsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDepositsInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDepositsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
