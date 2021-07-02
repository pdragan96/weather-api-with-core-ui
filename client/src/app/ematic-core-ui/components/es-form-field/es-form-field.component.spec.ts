import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsFormFieldComponent } from './es-form-field.component';

xdescribe('EsFormFieldComponent', () => {
  let component: EsFormFieldComponent;
  let fixture: ComponentFixture<EsFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsFormFieldComponent]
    });

    fixture = TestBed.createComponent(EsFormFieldComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
