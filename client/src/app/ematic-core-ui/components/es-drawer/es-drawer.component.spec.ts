import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsDrawerComponent } from './es-drawer.component';

describe('EsDrawerComponent', () => {
  let component: EsDrawerComponent;
  let fixture: ComponentFixture<EsDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDrawerComponent]
    });

    fixture = TestBed.createComponent(EsDrawerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
