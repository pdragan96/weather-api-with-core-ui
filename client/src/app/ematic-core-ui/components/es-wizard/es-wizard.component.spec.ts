import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsWizardComponent } from './es-wizard.component';

xdescribe('WizardComponent', () => {
  let component: EsWizardComponent;
  let fixture: ComponentFixture<EsWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsWizardComponent]
    });

    fixture = TestBed.createComponent(EsWizardComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
