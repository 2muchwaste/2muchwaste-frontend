import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenResourceComponent } from './forbidden-resource.component';

describe('ForbiddenResourceComponent', () => {
  let component: ForbiddenResourceComponent;
  let fixture: ComponentFixture<ForbiddenResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForbiddenResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbiddenResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
