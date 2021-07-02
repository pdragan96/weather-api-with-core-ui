import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsTabComponent } from './es-tab.component';

describe('EsTabComponent', () => {
  let component: EsTabComponent;
  let fixture: ComponentFixture<EsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EsTabComponent ]
    });

    fixture = TestBed.createComponent(EsTabComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
