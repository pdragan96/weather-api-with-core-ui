import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsSelectComponent } from './es-select.component';

xdescribe('EsLookupComponent', () => {
  let component: EsSelectComponent;
  let fixture: ComponentFixture<EsSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsSelectComponent]
    });

    fixture = TestBed.createComponent(EsSelectComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
