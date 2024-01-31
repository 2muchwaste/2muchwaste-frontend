import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptiesInformationComponent } from './empties-information.component';

describe('EmptiesInformationComponent', () => {
  let component: EmptiesInformationComponent;
  let fixture: ComponentFixture<EmptiesInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptiesInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptiesInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
