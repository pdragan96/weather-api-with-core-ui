import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsLoaderComponent } from './es-loader.component';

describe('EsLoaderComponent', () => {
  let component: EsLoaderComponent;
  let fixture: ComponentFixture<EsLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsLoaderComponent]
    });

    fixture = TestBed.createComponent(EsLoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
