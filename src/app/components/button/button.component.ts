import {Component, computed, inject, Input} from '@angular/core';
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

  @Input() studentText: string = '';
  @Input() teacherText: string = '';
  @Input() studentStyle: string = '';
  @Input() teacherStyle: string = '';

  buttonText = computed(() => (this.modeService.getMode() === 'student' ? this.studentText : this.teacherText));
  buttonStyle = computed(() => (this.modeService.getMode() === 'student' ? this.studentStyle : this.teacherStyle));
}
