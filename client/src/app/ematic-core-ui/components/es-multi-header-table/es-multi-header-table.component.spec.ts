import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsMultiHeaderTableComponent } from './es-multi-header-table.component';
import { mocks } from '../../test/mocks';

describe('EsMultiHeaderTableComponent', () => {
  let component: EsMultiHeaderTableComponent;
  let fixture: ComponentFixture<EsMultiHeaderTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsMultiHeaderTableComponent]
    });

    fixture = TestBed.createComponent(EsMultiHeaderTableComponent);
    component = fixture.componentInstance;
  });

  it('should create multi-header-table', () => {
    expect(component).toBeTruthy();
  });

  it('should get index for trackBy', () => {
    const spy = spyOn(component, 'trackByIndex');
    component.trackByIndex(1);
    const getIndex = spy.calls.first().args[0];
    expect(getIndex).toEqual(1);
  });

  it('should be type number for trackBy', () => {
    const spy = spyOn(component, 'trackByIndex');
    component.trackByIndex(8);
    const getIndex = spy.calls.first().args[0];
    expect(getIndex).toEqual(jasmine.any(Number));
  });

  it('should set record data', () => {
    component.records = mocks.tableData.recordData;
    expect(component.records).toBeTruthy();
  });

  it('should format column in table', () => {
    const columnFormat = component.formatColumn(
      mocks.tableData.recordData[0],
      mocks.tableData.columnData,
      mocks.tableData.recordIndex,
      mocks.tableData.columnIndex);
    expect(columnFormat).toBe('0.03%');
  });
});
