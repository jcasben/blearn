import {ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'blearn-button',
  imports: [
    NgClass
  ],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  modeService = inject(ModeService);

  @Input() studentText: string = '';
  @Input() teacherText: string = '';
  @Input() studentStyle: string = '';
  @Input() teacherStyle: string = '';
  @Input() disabled: boolean = false;
  @Input() icon?: string;

  @Output() clicked = new EventEmitter<void>();

  buttonText = computed(() => (this.modeService.getMode() === 'student' ? this.studentText : this.teacherText));
  buttonStyle = computed(() => (this.modeService.getMode() === 'student' ? this.studentStyle : this.teacherStyle));

  protected onClick() {
    if (!this.disabled) this.clicked.emit();
  }
}
