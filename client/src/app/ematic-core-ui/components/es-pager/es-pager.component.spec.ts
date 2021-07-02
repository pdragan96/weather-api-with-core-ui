import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsPagerComponent } from './es-pager.component';

xdescribe('EsPagerComponent', () => {
  let component: EsPagerComponent;
  let fixture: ComponentFixture<EsPagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsPagerComponent]
    });

    fixture = TestBed.createComponent(EsPagerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
