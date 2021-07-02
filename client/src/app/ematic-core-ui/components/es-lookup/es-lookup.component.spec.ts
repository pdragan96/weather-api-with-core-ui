import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsLookupComponent } from './es-lookup.component';

xdescribe('EsLookupComponent', () => {
  let component: EsLookupComponent;
  let fixture: ComponentFixture<EsLookupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsLookupComponent]
    });

    fixture = TestBed.createComponent(EsLookupComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
