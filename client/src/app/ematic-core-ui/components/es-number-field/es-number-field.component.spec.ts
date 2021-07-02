import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsNumberFieldComponent } from './es-number-field.component';

xdescribe('EsNumberFieldComponent', () => {
  let component: EsNumberFieldComponent;
  let fixture: ComponentFixture<EsNumberFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsNumberFieldComponent]
    });

    fixture = TestBed.createComponent(EsNumberFieldComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
