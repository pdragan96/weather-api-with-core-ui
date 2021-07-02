import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsFieldComponent } from './es-field.component';

xdescribe('EsFieldComponent', () => {
  let component: EsFieldComponent;
  let fixture: ComponentFixture<EsFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsFieldComponent]
    });

    fixture = TestBed.createComponent(EsFieldComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
