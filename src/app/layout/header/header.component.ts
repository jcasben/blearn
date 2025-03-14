import {Component, computed, inject, signal} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {NgClass} from '@angular/common';
import {ButtonComponent} from '../../components/button/button.component';
import {RouterLink} from '@angular/router';
import {TitleComponent} from '../../components/title/title.component';

@Component({
  selector: 'blearn-header',
  imports: [
    NgClass,
    ButtonComponent,
    RouterLink,
    TitleComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private modeService = inject(ModeService);

  headerText = computed(() => (this.modeService.getMode() === 'student' ? 'BLearn' : 'BLearn Teachers'));
  headerColor = computed(() => (this.modeService.getMode() === 'student' ? 'text-student' : 'text-teacher'));

  switchMode() {
    const nextMode = this.modeService.getMode() === 'student' ? 'teacher' : 'student';
    this.modeService.setMode(nextMode);
  }
}
