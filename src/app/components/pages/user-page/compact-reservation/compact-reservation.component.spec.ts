import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactReservationComponent } from './compact-reservation.component';

describe('CompactReservationComponent', () => {
  let component: CompactReservationComponent;
  let fixture: ComponentFixture<CompactReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
