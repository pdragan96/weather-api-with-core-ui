import { Component, OnInit, Input, Output, ElementRef, ViewChild,
  ContentChildren, QueryList, EventEmitter, AfterContentInit, HostListener } from '@angular/core';

import { EsWizardStepComponent } from './es-wizard-step/es-wizard-step.component';

@Component({
  selector: 'es-wizard',
  templateUrl: './es-wizard.component.html',
  styleUrls: ['./es-wizard.component.scss']
})
export class EsWizardComponent implements OnInit, AfterContentInit {
  @ViewChild('content', { static: true }) contentDiv: ElementRef;
  @ViewChild('scroller', { static: true }) scrollerDiv: ElementRef;

  @ContentChildren(EsWizardStepComponent) wizardSteps: QueryList<EsWizardStepComponent>;

  @Input() firstStep: number;

  @Output() step: EventEmitter<EsWizardStepComponent>;
  @Output() completed: EventEmitter<EsWizardStepComponent>;

  private _steps: EsWizardStepComponent[];
  get steps(): EsWizardStepComponent[] {
    return this._steps.filter(step => !step.isHidden);
  }

  get activeStep(): EsWizardStepComponent {
    return this._steps.find(step => step.isActive);
  }

  set activeStep(step: EsWizardStepComponent) {
    if (step !== this.activeStep && !step.isHidden) {
      step.isActive = true;
      step.isVisited = true;

      this.animateScroller(step);
    }
  }

  get activeStepIndex(): number {
    return this.activeStep.index;
  }

  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  get hasPreviousStep(): boolean {
    return this.activeStepIndex > 0;
  }

  isCompleted: boolean;
  contentDivWidth: number;

  constructor() {
    this._steps = [];
    this.isCompleted = false;
    this.firstStep = 0;
    this.contentDivWidth = 0;

    this.step = new EventEmitter<EsWizardStepComponent>();
    this.completed = new EventEmitter<EsWizardStepComponent>();
  }

  @HostListener('window:resize', ['$event'])
  public windowOnResize(event): void {
    const contentDivRect = this.contentDiv.nativeElement.getBoundingClientRect();
    this.contentDivWidth = contentDivRect.width;

    this._steps.forEach(step => step.width = this.contentDivWidth);

    this.animateScroller(this.activeStep);
  }

  ngOnInit() {
    const contentDivRect = this.contentDiv.nativeElement.getBoundingClientRect();
    this.contentDivWidth = contentDivRect.width;
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach((step, index) => {
      step.width = this.contentDivWidth;
      step.index = index;

      if (index < this.firstStep) {
        step.isVisited = true;
      }

      if (index === this.firstStep) {
        step.isActive = true;
      }

      this._steps.push(step);
    });

    this.animateScroller(this.activeStep);
  }

  animateScroller(next: EsWizardStepComponent) {
    this.scrollerDiv.nativeElement.setAttribute('style', `transform: translate3d(-${this.contentDivWidth * next.index}px,0px,0px)`);
  }

  onShowStep(step: EsWizardStepComponent) {
    const canActivate = step.index > this.activeStep.index ? this.activeStep.showNextButton : this.activeStep.showPreviousButton;

    if (!this.isCompleted && canActivate && this.activeStep.isValid) {
      this.activeStep.isVisited = true;
      this.activeStep.isActive = false;
      this.activeStep = step;
      this.step.emit(this.activeStep);
    }
  }

  onNext() {
    if (this.hasNextStep) {
      const nextStep: EsWizardStepComponent = this.steps[this.activeStepIndex + 1];
      this.onShowStep(nextStep);
    }
  }

  onPrevious() {
    if (this.hasPreviousStep) {
      const previousStep: EsWizardStepComponent = this.steps[this.activeStepIndex - 1];
      this.onShowStep(previousStep);
    }
  }

  onComplete() {
    if (this.activeStep.isValid) {
      this.isCompleted = true;
      this.completed.emit(this.activeStep);
    }
  }
}
