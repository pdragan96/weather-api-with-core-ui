import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsModalComponent } from './es-modal.component';

xdescribe('EsModalComponent', () => {
  let component: EsModalComponent;
  let fixture: ComponentFixture<EsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsModalComponent]
    });

    fixture = TestBed.createComponent(EsModalComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
