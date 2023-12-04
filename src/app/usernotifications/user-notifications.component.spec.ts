import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotificationsComponent } from './user-notifications.component';

describe('UsernotificationsComponent', () => {
  let component: UserNotificationsComponent;
  let fixture: ComponentFixture<UserNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});