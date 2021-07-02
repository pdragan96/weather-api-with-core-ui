/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsGroupedDataTableComponent } from './es-grouped-data-table.component';

xdescribe('GroupedDataTableComponent', () => {
  let component: EsGroupedDataTableComponent;
  let fixture: ComponentFixture<EsGroupedDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsGroupedDataTableComponent]
    });

    fixture = TestBed.createComponent(EsGroupedDataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
