/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsDropdownContainerComponent } from './es-dropdown-container.component';

xdescribe('EsDropdownContainerComponent', () => {
  let component: EsDropdownContainerComponent;
  let fixture: ComponentFixture<EsDropdownContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDropdownContainerComponent]
    });

    fixture = TestBed.createComponent(EsDropdownContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
