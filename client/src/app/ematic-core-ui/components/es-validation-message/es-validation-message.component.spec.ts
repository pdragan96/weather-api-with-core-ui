import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsValidationMessageComponent } from './es-validation-message.component';

xdescribe('EsValidationMessageComponent', () => {
  let component: EsValidationMessageComponent;
  let fixture: ComponentFixture<EsValidationMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsValidationMessageComponent]
    });

    fixture = TestBed.createComponent(EsValidationMessageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
