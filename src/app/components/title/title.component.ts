import {Component, computed, inject, Input} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'blearn-title',
  imports: [
    NgClass
  ],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {
  modeService = inject(ModeService);

  @Input() studentText = '';
  @Input() teacherText = '';
  @Input() studentStyle = '';
  @Input() teacherStyle = '';

  titleText = computed(() => (this.modeService.getMode() === 'student' ? this.studentText : this.teacherText));
  titleStyle = computed(() => (this.modeService.getMode() === 'student' ? this.studentStyle : this.teacherStyle));
}
