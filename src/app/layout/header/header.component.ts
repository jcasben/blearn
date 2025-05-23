import {Component, inject} from '@angular/core';
import {ModeService} from '../../services/mode.service';
import {ButtonComponent} from '../button/button.component';
import {Router, RouterLink} from '@angular/router';
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
  private router = inject(Router)

  switchMode() {
    if (!confirm("Are you sure that you want to change modes?")) return;
    const nextMode = this.modeService.getMode() === 'student' ? 'teacher' : 'student';
    this.modeService.setMode(nextMode);
    this.router.navigate(['/']).then();
  }
}
