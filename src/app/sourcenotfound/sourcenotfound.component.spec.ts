import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcenotfoundComponent } from './sourcenotfound.component';

describe('SourcenotfoundComponent', () => {
  let component: SourcenotfoundComponent;
  let fixture: ComponentFixture<SourcenotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourcenotfoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcenotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
