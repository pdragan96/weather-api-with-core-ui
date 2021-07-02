import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCheckboxComponent } from './es-checkbox.component';

xdescribe('EsCheckboxComponent', () => {
  let component: EsCheckboxComponent;
  let fixture: ComponentFixture<EsCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsCheckboxComponent]
    });

    fixture = TestBed.createComponent(EsCheckboxComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
