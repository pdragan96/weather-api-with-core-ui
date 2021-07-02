import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EsLookupComponent } from '../es-lookup/es-lookup.component';
import { EsSelectComponent } from '../es-select/es-select.component';
import { EsMultiSelectComponent } from '../es-multi-select/es-multi-select.component';

import { EsHeaderFilterComponent } from './es-header-filter.component';

import { mocks } from '../../test/mocks';

describe('HeaderFilterComponent', () => {
  let component: EsHeaderFilterComponent;
  let fixture: ComponentFixture<EsHeaderFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EsHeaderFilterComponent,
        EsLookupComponent,
        EsSelectComponent,
        EsMultiSelectComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        mocks.stateService
      ]
    });

    fixture = TestBed.createComponent(EsHeaderFilterComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
