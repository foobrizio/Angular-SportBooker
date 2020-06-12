import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactFieldComponent } from './compact-field.component';

describe('CompactFieldComponent', () => {
  let component: CompactFieldComponent;
  let fixture: ComponentFixture<CompactFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
