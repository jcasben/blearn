import {Component, computed, inject, signal} from '@angular/core';
import {ModeService} from "../../services/mode.service";
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  selector: 'blearn-home',
  imports: [
    ButtonComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  modeService = inject(ModeService);

  welcomeName = computed(() => (this.modeService.getMode() === 'student' ? 'Student' : 'Teacher'));
}
