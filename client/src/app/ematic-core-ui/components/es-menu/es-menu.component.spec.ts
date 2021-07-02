import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsMenuComponent } from './es-menu.component';

xdescribe('EsMenuComponent', () => {
  let component: EsMenuComponent;
  let fixture: ComponentFixture<EsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsMenuComponent]
    });

    fixture = TestBed.createComponent(EsMenuComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
