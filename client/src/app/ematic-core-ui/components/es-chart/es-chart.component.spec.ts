import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsChartComponent } from './es-chart.component';

xdescribe('EsChartComponent', () => {
  let component: EsChartComponent;
  let fixture: ComponentFixture<EsChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EsChartComponent ]
    });

    fixture = TestBed.createComponent(EsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
