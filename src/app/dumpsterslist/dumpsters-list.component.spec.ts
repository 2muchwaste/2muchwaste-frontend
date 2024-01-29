import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DumpstersListComponent} from './dumpsters-list.component';

describe('DumpsterslistComponent', () => {
  let component: DumpstersListComponent;
  let fixture: ComponentFixture<DumpstersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DumpstersListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpstersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
