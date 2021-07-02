import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsTagSelectComponent } from './es-tag-select.component';

describe('EsTagSelectComponent', () => {
  let component: EsTagSelectComponent;
  let fixture: ComponentFixture<EsTagSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsTagSelectComponent]
    });

    fixture = TestBed.createComponent(EsTagSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
