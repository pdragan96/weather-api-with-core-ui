import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsMultiSelectComponent } from './es-multi-select.component';

xdescribe('EsMultiSelectComponent', () => {
  let component: EsMultiSelectComponent;
  let fixture: ComponentFixture<EsMultiSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsMultiSelectComponent]
    });

    fixture = TestBed.createComponent(EsMultiSelectComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
