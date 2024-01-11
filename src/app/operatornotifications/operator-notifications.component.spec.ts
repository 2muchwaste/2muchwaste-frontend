import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorNotificationsComponent } from './operator-notifications.component';

describe('OperatorNotificationsComponent', () => {
  let component: OperatorNotificationsComponent;
  let fixture: ComponentFixture<OperatorNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
