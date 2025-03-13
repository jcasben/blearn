import {Component, computed, inject, Input, signal} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'blearn-button',
  imports: [
    NgClass
  ],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  modeService = inject(ModeService);

  @Input() studentText: string | undefined;
  @Input() teacherText: string | undefined;
  @Input() studentStyle: string | undefined;
  @Input() teacherStyle: string | undefined;

  buttonText = computed(() => (this.modeService.getMode() === 'student' ? this.studentText : this.teacherText));
  buttonStyle = computed(() => (this.modeService.getMode() === 'student' ? this.studentStyle : this.teacherStyle));
}
