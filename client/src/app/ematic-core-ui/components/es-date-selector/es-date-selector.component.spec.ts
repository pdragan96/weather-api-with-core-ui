import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsDateSelectorComponent } from './es-date-selector.component';

xdescribe('EsDateSelectorComponent', () => {
  let component: EsDateSelectorComponent;
  let fixture: ComponentFixture<EsDateSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDateSelectorComponent]
    });

    fixture = TestBed.createComponent(EsDateSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
