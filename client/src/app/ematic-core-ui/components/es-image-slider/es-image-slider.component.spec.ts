import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsImageSliderComponent } from './es-image-slider.component';

describe('EsImageSliderComponent', () => {
  let component: EsImageSliderComponent;
  let fixture: ComponentFixture<EsImageSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsImageSliderComponent]
    });

    fixture = TestBed.createComponent(EsImageSliderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
