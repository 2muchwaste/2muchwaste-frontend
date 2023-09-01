import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationslotComponent } from './notificationslot.component';

describe('NotificationslotComponent', () => {
  let component: NotificationslotComponent;
  let fixture: ComponentFixture<NotificationslotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationslotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
