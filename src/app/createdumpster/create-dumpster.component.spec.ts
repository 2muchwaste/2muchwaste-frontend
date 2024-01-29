import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDumpsterComponent } from './create-dumpster.component';

describe('CreatedumpsterComponent', () => {
  let component: CreateDumpsterComponent;
  let fixture: ComponentFixture<CreateDumpsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDumpsterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDumpsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
