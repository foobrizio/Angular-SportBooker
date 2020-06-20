import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactCompanyComponent } from './compact-company.component';

describe('CompactCompanyComponent', () => {
  let component: CompactCompanyComponent;
  let fixture: ComponentFixture<CompactCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
