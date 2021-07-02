import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type ButtonType = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'cancel';

@Component({
  selector: 'es-button',
  templateUrl: './es-button.component.html',
  styleUrls: ['./es-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsButtonComponent implements OnInit {
  @Input() text: string;
  @Input() type: ButtonType;
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() isRounded: boolean;

  @Output() clicked: EventEmitter<boolean>;

  get btnClass(): string {
    switch (this.type) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'success':
        return 'btn-success';
      case 'info':
        return 'btn-info';
      case 'warning':
        return 'btn-warning';
      case 'danger':
        return 'btn-danger';
      case 'cancel':
        return 'btn-cancel';
    }
  }

  constructor() {
    this.type = 'primary';
    this.disabled = false;
    this.text = 'Click me :)';
    this.loading = false;
    this.isRounded = false;

    this.clicked = new EventEmitter<boolean>();
  }

  ngOnInit() {
  }

  doClick() {
    if (!this.loading && !this.disabled) {
      this.clicked.emit(true);
    }
  }
}
