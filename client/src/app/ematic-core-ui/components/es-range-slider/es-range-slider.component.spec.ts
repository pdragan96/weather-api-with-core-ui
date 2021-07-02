import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsRangeSliderComponent } from './es-range-slider.component';

describe('EsRangeSliderComponent', () => {
  let component: EsRangeSliderComponent;
  let fixture: ComponentFixture<EsRangeSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsRangeSliderComponent]
    });

    fixture = TestBed.createComponent(EsRangeSliderComponent);
    component = fixture.componentInstance;

    component.min = 1;
    component.max = 99;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('updateSliderBackground', () => {
    it('should set background size to \'0% 100%\' if value is less than minimal allowed value', () => {
      component.innerValue = 0;
      component.updateSliderBackground();

      expect(component.backgroundSize).toBe('0% 100%');
    });

    it('should set background size to \'100% 100%\' if value is greater than maximum allowed value', () => {
      component.innerValue = 100;
      component.updateSliderBackground();

      expect(component.backgroundSize).toBe('100% 100%');
    });

    it('should set first background size percentage in relation to the provided value', () => {
      component.innerValue = 50;
      component.updateSliderBackground();

      expect(component.backgroundSize).toBe('50% 100%');
    });
  });
});
