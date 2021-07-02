import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsDropdownFieldComponent } from './es-dropdown-field.component';

xdescribe('EsDropdownFieldComponent', () => {
  let component: EsDropdownFieldComponent;
  let fixture: ComponentFixture<EsDropdownFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDropdownFieldComponent]
    });

    fixture = TestBed.createComponent(EsDropdownFieldComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
