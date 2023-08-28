import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptydumpsterComponent } from './emptydumpster.component';

describe('EmptydumpsterComponent', () => {
  let component: EmptydumpsterComponent ;
  let fixture: ComponentFixture<EmptydumpsterComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptydumpsterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptydumpsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
