import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsAccordionComponent } from './es-accordion.component';

xdescribe('EsAccordionComponent', () => {
  let component: EsAccordionComponent;
  let fixture: ComponentFixture<EsAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsAccordionComponent]
    });

    fixture = TestBed.createComponent(EsAccordionComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
