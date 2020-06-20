import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactReviewComponent } from './compact-review.component';

describe('CompactReviewComponent', () => {
  let component: CompactReviewComponent;
  let fixture: ComponentFixture<CompactReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
