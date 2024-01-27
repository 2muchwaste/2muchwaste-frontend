import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedumpsterComponent } from './createdumpster.component';

describe('CreatedumpsterComponent', () => {
  let component: CreatedumpsterComponent;
  let fixture: ComponentFixture<CreatedumpsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedumpsterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedumpsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
