import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsTextFieldComponent } from './es-text-field.component';

xdescribe('EsTextFieldComponent', () => {
  let component: EsTextFieldComponent;
  let fixture: ComponentFixture<EsTextFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsTextFieldComponent]
    });

    fixture = TestBed.createComponent(EsTextFieldComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
