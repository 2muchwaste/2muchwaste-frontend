import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdepositsinformationComponent } from './userdepositsinformation.component';

describe('UserdepositsinformationComponent', () => {
  let component: UserdepositsinformationComponent;
  let fixture: ComponentFixture<UserdepositsinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdepositsinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdepositsinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
