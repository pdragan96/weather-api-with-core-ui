/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsButtonComponent } from './es-button.component';

xdescribe('EsButtonComponent', () => {
  let component: EsButtonComponent;
  let fixture: ComponentFixture<EsButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsButtonComponent]
    });

    fixture = TestBed.createComponent(EsButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
