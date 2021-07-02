import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsDropdownSearchComponent } from './es-dropdown-search.component';

xdescribe('EsDropdownSearchComponent', () => {
  let component: EsDropdownSearchComponent;
  let fixture: ComponentFixture<EsDropdownSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDropdownSearchComponent]
    });

    fixture = TestBed.createComponent(EsDropdownSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
