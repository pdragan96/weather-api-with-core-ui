import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsWizardStepComponent } from './es-wizard-step.component';

describe('WizardStepComponent', () => {
  let component: EsWizardStepComponent;
  let fixture: ComponentFixture<EsWizardStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsWizardStepComponent]
    });

    fixture = TestBed.createComponent(EsWizardStepComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
