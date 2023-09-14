import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenresourceComponent } from './forbiddenresource.component';

describe('ForbiddenresourceComponent', () => {
  let component: ForbiddenresourceComponent;
  let fixture: ComponentFixture<ForbiddenresourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForbiddenresourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbiddenresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
