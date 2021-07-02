import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'es-wizard-step',
  templateUrl: './es-wizard-step.component.html',
  styleUrls: ['./es-wizard-step.component.scss']
})
export class EsWizardStepComponent implements OnInit {
  @Input() titleText: string;
  @Input() isActive: boolean;
  @Input() isValid: boolean;
  @Input() isHidden: boolean;

  @Input() showNextButton: boolean;
  @Input() showPreviousButton: boolean;
  @Input() showCompleteButton: boolean;

  @Input() index: number;
  @Input() width: number;

  isVisited: boolean;

  constructor() {
    this.titleText = null;
    this.isActive = false;
    this.isValid = true;
    this.isHidden = false;
    this.isVisited = false;

    this.showNextButton = true;
    this.showPreviousButton = true;
    this.showCompleteButton = true;

    this.index = 0;
    this.width = 0;
  }

  ngOnInit() {
  }
}
