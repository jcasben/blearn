import {Component, inject} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {ButtonComponent} from '../../components/button/button.component';
import {RouterLink} from '@angular/router';
import {TitleComponent} from '../../components/title/title.component';

@Component({
  selector: 'blearn-header',
  imports: [
    ButtonComponent,
    RouterLink,
    TitleComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private modeService = inject(ModeService);

  switchMode() {
    const nextMode = this.modeService.getMode() === 'student' ? 'teacher' : 'student';
    this.modeService.setMode(nextMode);
  }
}
