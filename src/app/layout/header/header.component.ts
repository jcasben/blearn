import {Component, computed, inject, signal} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {NgClass} from '@angular/common';
import {ButtonComponent} from '../../components/button/button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'blearn-header',
  imports: [
    NgClass,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private modeService = inject(ModeService);

  headerText2 = computed(() => (this.modeService.getMode() === 'student' ? 'BLearn' : 'BLearn Teachers'));
  headerColor2 = computed(() => (this.modeService.getMode() === 'student' ? 'text-student' : 'text-teacher'));

  switchMode() {
    const nextMode = this.modeService.getMode() === 'student' ? 'teacher' : 'student';
    this.modeService.setMode(nextMode);
  }
}
