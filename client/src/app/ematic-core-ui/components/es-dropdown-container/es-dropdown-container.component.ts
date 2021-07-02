import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef
} from '@angular/core';

import { EsDropdownField } from '../base/es-dropdown-field';
import { dropdownContainer } from './es-dropdown-container-animations';
import { DropdownAlignment } from '../../directives/es-dropdown/es-dropdown.directive';

@Component({
  selector: 'es-dropdown-container',
  templateUrl: './es-dropdown-container.component.html',
  styleUrls: ['./es-dropdown-container.component.scss'],
  animations: [
    dropdownContainer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsDropdownContainerComponent extends EsDropdownField<any> implements OnInit {
  @Input() arrowPosition: DropdownAlignment;
  @Input() hasOkButton: boolean;
  @Input() okButtonText: string;
  @Input() cancelButtonText: string;
  @Input() shrinkDropdown: boolean;

  @Output() cancelClick: EventEmitter<boolean>;
  @Output() okClick: EventEmitter<boolean>;

  @ContentChild(TemplateRef, { static: true }) dropdownTemplate: TemplateRef<any>;

  get isLeft(): boolean {
    return this.arrowPosition === 'left';
  }

  get isRight(): boolean {
    return this.arrowPosition === 'right';
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2) {

    super(element, renderer, null, null, null);

    this.arrowPosition = 'left';

    this.hasOkButton = false;
    this.okButtonText = 'OK';
    this.cancelButtonText = 'Cancel';

    this.cancelClick = new EventEmitter<boolean>();
    this.okClick = new EventEmitter<boolean>();

    this._renderer.setStyle(this._element.nativeElement, 'margin-top', this._isMobile ? '0px' : '10px');
    this.shrinkDropdown = false;
  }

  @HostBinding('@dropdownContainer')
  get animateDropdownContainer() {
    return true;
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResizeDropdownContainer(event: Event): void {
    super.onWindowResizeDropdownField(event);
    this._renderer.setStyle(this._element.nativeElement, 'margin-top', this._isMobile ? '0px' : '10px');
  }

  ngOnInit() {
  }

  onOk() {
    this.okClick.emit(true);
  }

  onCancel() {
    this.cancelClick.emit(true);
  }
}
