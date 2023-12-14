import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceNotFoundComponent } from './source-not-found.component';

describe('SourceNotFoundComponent', () => {
  let component: SourceNotFoundComponent;
  let fixture: ComponentFixture<SourceNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
