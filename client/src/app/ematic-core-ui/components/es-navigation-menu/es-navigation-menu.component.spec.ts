import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsNavigationMenuComponent } from './es-navigation-menu.component';

xdescribe('EsNavigationMenuComponent', () => {
  let component: EsNavigationMenuComponent;
  let fixture: ComponentFixture<EsNavigationMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsNavigationMenuComponent]
    });

    fixture = TestBed.createComponent(EsNavigationMenuComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
