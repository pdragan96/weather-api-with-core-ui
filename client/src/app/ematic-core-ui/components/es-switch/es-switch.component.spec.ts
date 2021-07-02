import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsSwitchComponent } from './es-switch.component';

xdescribe('EsSwitchComponent', () => {
  let component: EsSwitchComponent;
  let fixture: ComponentFixture<EsSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsSwitchComponent]
    });

    fixture = TestBed.createComponent(EsSwitchComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
