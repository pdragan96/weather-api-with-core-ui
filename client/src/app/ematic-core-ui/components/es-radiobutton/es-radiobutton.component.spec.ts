import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsRadiobuttonComponent } from './es-radiobutton.component';

xdescribe('EsRadiobuttonComponent', () => {
  let component: EsRadiobuttonComponent;
  let fixture: ComponentFixture<EsRadiobuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsRadiobuttonComponent]
    });

    fixture = TestBed.createComponent(EsRadiobuttonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
