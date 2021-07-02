import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsRangePickerComponent } from './es-range-picker.component';

xdescribe('EsRangePickerComponent', () => {
  let component: EsRangePickerComponent;
  let fixture: ComponentFixture<EsRangePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsRangePickerComponent]
    });

    fixture = TestBed.createComponent(EsRangePickerComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
