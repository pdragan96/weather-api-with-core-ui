import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsTabsComponent } from './es-tabs.component';

describe('EsTabsComponent', () => {
  let component: EsTabsComponent;
  let fixture: ComponentFixture<EsTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsTabsComponent]
    });

    fixture = TestBed.createComponent(EsTabsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
