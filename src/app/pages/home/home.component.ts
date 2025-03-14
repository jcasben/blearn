import {Component, inject} from '@angular/core';
import {ModeService} from "../../services/mode.service";
import {ButtonComponent} from '../../components/button/button.component';
import {TitleComponent} from '../../components/title/title.component';

@Component({
  selector: 'blearn-home',
  imports: [
    ButtonComponent,
    TitleComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  modeService = inject(ModeService);
}
