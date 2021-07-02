import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsDatePickerComponent } from './es-date-picker.component';

xdescribe('EsDatePickerComponent', () => {
  let component: EsDatePickerComponent;
  let fixture: ComponentFixture<EsDatePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDatePickerComponent]
    });

    fixture = TestBed.createComponent(EsDatePickerComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
