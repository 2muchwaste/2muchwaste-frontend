import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoperComponent } from './signoper.component';

describe('SignoperComponent', () => {
  let component: SignoperComponent;
  let fixture: ComponentFixture<SignoperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignoperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignoperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
